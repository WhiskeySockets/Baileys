import { Boom } from '@hapi/boom'
import { proto } from '../../WAProto/index.js'
import { type BinaryNode } from './types'

// Return all children with a given tag
export const getBinaryNodeChildren = (node: BinaryNode | undefined, childTag: string): BinaryNode[] => {
  return Array.isArray(node?.content)
    ? node.content.filter(item => item.tag === childTag)
    : []
}

// Return all children regardless of tag
export const getAllBinaryNodeChildren = ({ content }: BinaryNode): BinaryNode[] => {
  return Array.isArray(content) ? content : []
}

// Return first child matching tag
export const getBinaryNodeChild = (node: BinaryNode | undefined, childTag: string): BinaryNode | undefined => {
  return Array.isArray(node?.content)
    ? node.content.find(item => item.tag === childTag)
    : undefined
}

// Return child content as Buffer or Uint8Array
export const getBinaryNodeChildBuffer = (node: BinaryNode | undefined, childTag: string): Buffer | Uint8Array | undefined => {
  const child = getBinaryNodeChild(node, childTag)?.content
  return Buffer.isBuffer(child) || child instanceof Uint8Array ? child : undefined
}

// Return child content as string
export const getBinaryNodeChildString = (node: BinaryNode | undefined, childTag: string): string | undefined => {
  const child = getBinaryNodeChild(node, childTag)?.content
  if (Buffer.isBuffer(child) || child instanceof Uint8Array) {
    return Buffer.from(child).toString('utf-8')
  }
  if (typeof child === 'string') {
    return child
  }
  return undefined
}

// Return unsigned int parsed from child buffer
export const getBinaryNodeChildUInt = (node: BinaryNode, childTag: string, length: number): number | undefined => {
  const buff = getBinaryNodeChildBuffer(node, childTag)
  return buff ? bufferToUInt(buff, length) : undefined
}

// Throw if <error> child is present
export const assertNodeErrorFree = (node: BinaryNode): void => {
  const errNode = getBinaryNodeChild(node, 'error')
  if (errNode) {
    throw new Boom(errNode.attrs.text || 'Unknown error', {
      data: Number(errNode.attrs.code)
    })
  }
}

// Reduce children with matching tag to dictionary
export const reduceBinaryNodeToDictionary = (node: BinaryNode, tag: string): Record<string,string> => {
  const nodes = getBinaryNodeChildren(node, tag)
  return nodes.reduce((dict, { attrs }) => {
    const key = typeof attrs.name === 'string' ? attrs.name : attrs.config_code!
    const value = attrs.value ?? attrs.config_value!
    dict[key] = value
    return dict
  }, {} as Record<string,string>)
}

// Extract all <message> nodes and decode them
export const getBinaryNodeMessages = ({ content }: BinaryNode): proto.WebMessageInfo[] => {
  const msgs: proto.WebMessageInfo[] = []
  if (Array.isArray(content)) {
    for (const item of content) {
      if (item.tag === 'message') {
        msgs.push(proto.WebMessageInfo.decode(item.content as Buffer))
      }
    }
  }
  return msgs
}

// Convert buffer to unsigned integer
function bufferToUInt(buffer: Uint8Array | Buffer, length: number): number {
  let result = 0
  for (let i = 0; i < length; i++) {
    result = result * 256 + buffer[i]!
  }
  return result
}

// Helper for indentation
const tabs = (n: number): string => '\t'.repeat(n)

// Serialize BinaryNode or content to string
export function binaryNodeToString(node: BinaryNode | BinaryNode['content'], indent = 0): string {
  if (!node) return ''

  if (typeof node === 'string') {
    return tabs(indent) + node
  }

  if (node instanceof Uint8Array) {
    return tabs(indent) + Buffer.from(node).toString('hex')
  }

  if (Array.isArray(node)) {
    return node.map(child => binaryNodeToString(child, indent + 1)).join('\n')
  }

  const attrs = Object.entries(node.attrs || {})
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}='${v}'`)
    .join(' ')
  const children = binaryNodeToString(node.content, indent + 1)
  const openTag = `<${node.tag}${attrs ? ' ' + attrs : ''}`
  const closeTag = children
    ? `>\n${children}\n${tabs(indent)}</${node.tag}>`
    : '/>'
  return tabs(indent) + openTag + closeTag
}

// New utility: get attribute as string
export const getBinaryNodeAttrString = (node: BinaryNode | undefined, attr: string): string | undefined => {
  return node?.attrs?.[attr] as string | undefined
}

// New utility: get attribute as number
export const getBinaryNodeAttrNumber = (node: BinaryNode | undefined, attr: string): number | undefined => {
  const val = node?.attrs?.[attr]
  if (typeof val === 'string') {
    const num = parseInt(val, 10)
    return isNaN(num) ? undefined : num
  }
  return undefined
}

// New utility: get attribute as boolean
export const getBinaryNodeAttrBoolean = (node: BinaryNode | undefined, attr: string): boolean | undefined => {
  const val = node?.attrs?.[attr]
  if (val === 'true' || val === '1') return true
  if (val === 'false' || val === '0') return false
  return undefined
}

// New utility: convert BinaryNode to JSON
export function binaryNodeToJSON(node: BinaryNode | BinaryNode['content']): any {
  if (!node) return null
  if (typeof node === 'string') return node
  if (node instanceof Uint8Array) return Buffer.from(node).toString('hex')
  if (Array.isArray(node)) {
    return node.map(child => binaryNodeToJSON(child))
  }
  return {
    tag: node.tag,
    attrs: node.attrs,
    content: Array.isArray(node.content)
      ? node.content.map(child => binaryNodeToJSON(child))
      : typeof node.content === 'string'
      ? node.content
      : node.content instanceof Uint8Array
      ? Buffer.from(node.content).toString('hex')
      : null
  }
}

// New utility: validate node for required tags and attributes
export const validateBinaryNode = (
  node: BinaryNode,
  options: { requiredTags?: string[]; requiredAttrs?: string[] }
): void => {
  const { requiredTags, requiredAttrs } = options
  if (requiredTags) {
    for (const tag of requiredTags) {
      if (!getBinaryNodeChild(node, tag)) {
        throw new Boom(`Missing required child <${tag}>`, { data: node })
      }
    }
  }
  if (requiredAttrs) {
    for (const attr of requiredAttrs) {
      if (node.attrs?.[attr] === undefined) {
        throw new Boom(`Missing required attribute '${attr}' on <${node.tag}>`, { data: node })
      }
    }
  }
}
