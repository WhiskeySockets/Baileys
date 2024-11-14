/// <reference types="node" />
/// <reference types="node" />
import type { BinaryNode, BinaryNodeCodingOptions } from './types';
export declare const encodeBinaryNode: (node: BinaryNode, opts?: Pick<BinaryNodeCodingOptions, 'TAGS' | 'TOKEN_MAP'>, buffer?: number[]) => Buffer;
