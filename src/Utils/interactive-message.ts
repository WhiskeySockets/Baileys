/**
 * Interactive Message Utilities for Baileys-Joss
 * Fitur yang tidak ada di Baileys Original
 * 
 * @module interactive-message
 */

import { proto } from '../../WAProto/index.js'
import type { WAMediaUpload, WAMessageContent } from '../Types'
import { prepareWAMessageMedia } from './messages'
import type { MediaGenerationOptions } from '../Types/Message'

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface InteractiveButton {
    /** Display text on button */
    name: string
    /** Button ID for callback */
    buttonId: string
    /** Button text */
    displayText: string
}

export interface InteractiveButtonReply extends InteractiveButton {
    /** Index of button */
    index?: number
}

export interface QuickReplyButton {
    id: string
    displayText: string
}

export interface UrlButton {
    displayText: string
    url: string
    /** Merchant URL for tracking */
    merchantUrl?: string
}

export interface CallButton {
    displayText: string
    phoneNumber: string
}

export interface CopyButton {
    displayText: string
    copyCode: string
}

export interface ListSection {
    title: string
    rows: ListRow[]
}

export interface ListRow {
    /** Unique row ID */
    rowId: string
    title: string
    description?: string
}

export interface InteractiveListMessage {
    /** Title di header */
    title: string
    /** Button text untuk expand list */
    buttonText: string
    /** Sections dengan rows */
    sections: ListSection[]
    /** Footer text */
    footer?: string
    /** Description/body text */
    description?: string
}

export interface InteractiveButtonsMessage {
    /** Header text */
    title?: string
    /** Body text */
    body: string
    /** Footer text */
    footer?: string
    /** List of buttons */
    buttons: InteractiveButton[]
    /** Optional header image */
    headerImage?: WAMediaUpload
    /** Optional header video */
    headerVideo?: WAMediaUpload
    /** Optional header document */
    headerDocument?: WAMediaUpload & { filename?: string }
}

export interface TemplateButton {
    index: number
    quickReplyButton?: QuickReplyButton
    urlButton?: UrlButton
    callButton?: CallButton
}

export interface TemplateMessage {
    /** Namespace - usually 'default' */
    namespace?: string
    /** Header text */
    title?: string
    /** Body text */
    body: string
    /** Footer text */
    footer?: string
    /** Buttons */
    buttons: TemplateButton[]
    /** Optional header image */
    headerImage?: WAMediaUpload
    /** Optional header video */
    headerVideo?: WAMediaUpload
    /** Optional header location */
    headerLocation?: {
        latitude: number
        longitude: number
        name?: string
        address?: string
    }
}

export interface CarouselCard {
    header: {
        imageMessage?: proto.Message.IImageMessage
        title?: string
    }
    body: { text: string }
    footer?: { text: string }
    buttons: InteractiveButton[]
}

export interface CarouselMessage {
    cards: CarouselCard[]
    /** Message ID untuk correlation */
    messageParentId?: string
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Membuat interactive buttons message (type baru yang work)
 * Ini menggunakan format yang lebih compatible dengan WA
 */
export const generateInteractiveButtonMessage = async (
    content: InteractiveButtonsMessage,
    options?: MediaGenerationOptions
): Promise<WAMessageContent> => {
    const buttons = content.buttons.map((btn, idx) => ({
        buttonId: btn.buttonId || `btn-${idx}`,
        buttonText: { displayText: btn.displayText },
        type: proto.Message.ButtonsMessage.Button.Type.RESPONSE,
        nativeFlowInfo: undefined
    }))

    const buttonsMessage: proto.Message.IButtonsMessage = {
        contentText: content.body,
        footerText: content.footer,
        buttons,
        headerType: proto.Message.ButtonsMessage.HeaderType.EMPTY
    }

    // Handle header media
    if (content.headerImage && options) {
        const media = await prepareWAMessageMedia({ image: content.headerImage }, options)
        buttonsMessage.imageMessage = media.imageMessage
        buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.IMAGE
    } else if (content.headerVideo && options) {
        const media = await prepareWAMessageMedia({ video: content.headerVideo }, options)
        buttonsMessage.videoMessage = media.videoMessage
        buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.VIDEO
    } else if (content.headerDocument && options) {
        const media = await prepareWAMessageMedia({
            document: content.headerDocument,
            mimetype: 'application/pdf',
            fileName: content.headerDocument.filename
        }, options)
        buttonsMessage.documentMessage = media.documentMessage
        buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.DOCUMENT
    } else if (content.title) {
        buttonsMessage.text = content.title
        buttonsMessage.headerType = proto.Message.ButtonsMessage.HeaderType.TEXT
    }

    return { buttonsMessage }
}

/**
 * Membuat interactive list message
 * Format list selection dengan sections dan rows
 */
export const generateInteractiveListMessage = (
    content: InteractiveListMessage
): WAMessageContent => {
    const sections = content.sections.map(section => ({
        title: section.title,
        rows: section.rows.map(row => ({
            rowId: row.rowId,
            title: row.title,
            description: row.description || ''
        }))
    }))

    return {
        listMessage: {
            title: content.title,
            description: content.description || '',
            buttonText: content.buttonText,
            footerText: content.footer || '',
            listType: proto.Message.ListMessage.ListType.SINGLE_SELECT,
            sections
        }
    }
}

/**
 * Membuat template message dengan berbagai button types
 * Supports: Quick Reply, URL, Call buttons
 */
export const generateTemplateMessage = async (
    content: TemplateMessage,
    options?: MediaGenerationOptions
): Promise<WAMessageContent> => {
    const hydratedButtons = content.buttons.map((btn) => {
        const hydratedBtn: proto.IHydratedTemplateButton = {
            index: btn.index
        }

        if (btn.quickReplyButton) {
            hydratedBtn.quickReplyButton = {
                displayText: btn.quickReplyButton.displayText,
                id: btn.quickReplyButton.id
            }
        } else if (btn.urlButton) {
            hydratedBtn.urlButton = {
                displayText: btn.urlButton.displayText,
                url: btn.urlButton.url
            }
        } else if (btn.callButton) {
            hydratedBtn.callButton = {
                displayText: btn.callButton.displayText,
                phoneNumber: btn.callButton.phoneNumber
            }
        }

        return hydratedBtn
    })

    const hydratedTemplate: proto.Message.TemplateMessage.IHydratedFourRowTemplate = {
        hydratedContentText: content.body,
        hydratedFooterText: content.footer,
        hydratedButtons
    }

    // Handle header
    if (content.title) {
        hydratedTemplate.hydratedTitleText = content.title
    }

    if (content.headerImage && options) {
        const media = await prepareWAMessageMedia({ image: content.headerImage }, options)
        hydratedTemplate.imageMessage = media.imageMessage
    } else if (content.headerVideo && options) {
        const media = await prepareWAMessageMedia({ video: content.headerVideo }, options)
        hydratedTemplate.videoMessage = media.videoMessage
    } else if (content.headerLocation) {
        hydratedTemplate.locationMessage = {
            degreesLatitude: content.headerLocation.latitude,
            degreesLongitude: content.headerLocation.longitude,
            name: content.headerLocation.name,
            address: content.headerLocation.address
        }
    }

    return {
        templateMessage: {
            hydratedTemplate
        }
    }
}

/**
 * Membuat native flow message (Interactive Message V2)
 * Ini format terbaru untuk interactive messages
 */
export const generateNativeFlowMessage = (
    body: string,
    buttons: Array<{ name: string; buttonParamsJson: string }>,
    options?: {
        footer?: string
        header?: {
            title?: string
            subtitle?: string
            hasMediaAttachment?: boolean
        }
    }
): WAMessageContent => {
    const nativeFlowButtons = buttons.map((btn, idx) => ({
        name: btn.name,
        buttonParamsJson: btn.buttonParamsJson
    }))

    return {
        interactiveMessage: {
            body: { text: body },
            footer: options?.footer ? { text: options.footer } : undefined,
            header: options?.header ? {
                title: options.header.title,
                subtitle: options.header.subtitle,
                hasMediaAttachment: options.header.hasMediaAttachment || false
            } : undefined,
            nativeFlowMessage: {
                buttons: nativeFlowButtons,
                messageParamsJson: ''
            }
        }
    }
}

/**
 * Membuat button dengan Copy Code (untuk OTP, codes, dll)
 */
export const generateCopyCodeButton = (
    body: string,
    copyCode: string,
    displayText: string = 'Copy Code',
    options?: { footer?: string }
): WAMessageContent => {
    return generateNativeFlowMessage(
        body,
        [{
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: displayText,
                copy_code: copyCode
            })
        }],
        options
    )
}

/**
 * Membuat button dengan URL
 */
export const generateUrlButtonMessage = (
    body: string,
    buttons: Array<{ displayText: string; url: string; merchantUrl?: string }>,
    options?: { footer?: string; title?: string }
): WAMessageContent => {
    const nativeButtons = buttons.map(btn => ({
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            url: btn.url,
            merchant_url: btn.merchantUrl
        })
    }))

    return generateNativeFlowMessage(body, nativeButtons, {
        footer: options?.footer,
        header: options?.title ? { title: options.title } : undefined
    })
}

/**
 * Membuat quick reply buttons
 */
export const generateQuickReplyButtons = (
    body: string,
    buttons: Array<{ id: string; displayText: string }>,
    options?: { footer?: string; title?: string }
): WAMessageContent => {
    const nativeButtons = buttons.map(btn => ({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
            display_text: btn.displayText,
            id: btn.id
        })
    }))

    return generateNativeFlowMessage(body, nativeButtons, {
        footer: options?.footer,
        header: options?.title ? { title: options.title } : undefined
    })
}

/**
 * Membuat combined buttons (mix URL, Quick Reply, Copy)
 */
export const generateCombinedButtons = (
    body: string,
    buttons: Array<
        | { type: 'url'; displayText: string; url: string }
        | { type: 'reply'; displayText: string; id: string }
        | { type: 'copy'; displayText: string; copyCode: string }
        | { type: 'call'; displayText: string; phoneNumber: string }
    >,
    options?: { footer?: string; title?: string }
): WAMessageContent => {
    const nativeButtons = buttons.map(btn => {
        switch (btn.type) {
            case 'url':
                return {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: btn.displayText,
                        url: btn.url
                    })
                }
            case 'reply':
                return {
                    name: 'quick_reply',
                    buttonParamsJson: JSON.stringify({
                        display_text: btn.displayText,
                        id: btn.id
                    })
                }
            case 'copy':
                return {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: btn.displayText,
                        copy_code: btn.copyCode
                    })
                }
            case 'call':
                return {
                    name: 'cta_call',
                    buttonParamsJson: JSON.stringify({
                        display_text: btn.displayText,
                        phone_number: btn.phoneNumber
                    })
                }
        }
    })

    return generateNativeFlowMessage(body, nativeButtons, {
        footer: options?.footer,
        header: options?.title ? { title: options.title } : undefined
    })
}

export default {
    generateInteractiveButtonMessage,
    generateInteractiveListMessage,
    generateTemplateMessage,
    generateNativeFlowMessage,
    generateCopyCodeButton,
    generateUrlButtonMessage,
    generateQuickReplyButtons,
    generateCombinedButtons
}
