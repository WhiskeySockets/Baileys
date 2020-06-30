import * as $protobuf from 'protobufjs'
/** Namespace proto. */
export namespace proto {
    /** Properties of a HydratedQuickReplyButton. */
    interface IHydratedQuickReplyButton {
        /** HydratedQuickReplyButton displayText */
        displayText?: string | null

        /** HydratedQuickReplyButton id */
        id?: string | null
    }

    /** Represents a HydratedQuickReplyButton. */
    class HydratedQuickReplyButton implements IHydratedQuickReplyButton {
        /**
         * Constructs a new HydratedQuickReplyButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHydratedQuickReplyButton)

        /** HydratedQuickReplyButton displayText. */
        public displayText: string

        /** HydratedQuickReplyButton id. */
        public id: string

        /**
         * Creates a new HydratedQuickReplyButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HydratedQuickReplyButton instance
         */
        public static create(properties?: proto.IHydratedQuickReplyButton): proto.HydratedQuickReplyButton

        /**
         * Encodes the specified HydratedQuickReplyButton message. Does not implicitly {@link proto.HydratedQuickReplyButton.verify|verify} messages.
         * @param message HydratedQuickReplyButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHydratedQuickReplyButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HydratedQuickReplyButton message, length delimited. Does not implicitly {@link proto.HydratedQuickReplyButton.verify|verify} messages.
         * @param message HydratedQuickReplyButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IHydratedQuickReplyButton,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a HydratedQuickReplyButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HydratedQuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HydratedQuickReplyButton

        /**
         * Decodes a HydratedQuickReplyButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HydratedQuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HydratedQuickReplyButton

        /**
         * Verifies a HydratedQuickReplyButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HydratedQuickReplyButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HydratedQuickReplyButton
         */
        public static fromObject(object: { [k: string]: any }): proto.HydratedQuickReplyButton

        /**
         * Creates a plain object from a HydratedQuickReplyButton message. Also converts values to other types if specified.
         * @param message HydratedQuickReplyButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HydratedQuickReplyButton,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HydratedQuickReplyButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HydratedURLButton. */
    interface IHydratedURLButton {
        /** HydratedURLButton displayText */
        displayText?: string | null

        /** HydratedURLButton url */
        url?: string | null
    }

    /** Represents a HydratedURLButton. */
    class HydratedURLButton implements IHydratedURLButton {
        /**
         * Constructs a new HydratedURLButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHydratedURLButton)

        /** HydratedURLButton displayText. */
        public displayText: string

        /** HydratedURLButton url. */
        public url: string

        /**
         * Creates a new HydratedURLButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HydratedURLButton instance
         */
        public static create(properties?: proto.IHydratedURLButton): proto.HydratedURLButton

        /**
         * Encodes the specified HydratedURLButton message. Does not implicitly {@link proto.HydratedURLButton.verify|verify} messages.
         * @param message HydratedURLButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHydratedURLButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HydratedURLButton message, length delimited. Does not implicitly {@link proto.HydratedURLButton.verify|verify} messages.
         * @param message HydratedURLButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IHydratedURLButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a HydratedURLButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HydratedURLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HydratedURLButton

        /**
         * Decodes a HydratedURLButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HydratedURLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HydratedURLButton

        /**
         * Verifies a HydratedURLButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HydratedURLButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HydratedURLButton
         */
        public static fromObject(object: { [k: string]: any }): proto.HydratedURLButton

        /**
         * Creates a plain object from a HydratedURLButton message. Also converts values to other types if specified.
         * @param message HydratedURLButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HydratedURLButton,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HydratedURLButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HydratedCallButton. */
    interface IHydratedCallButton {
        /** HydratedCallButton displayText */
        displayText?: string | null

        /** HydratedCallButton phoneNumber */
        phoneNumber?: string | null
    }

    /** Represents a HydratedCallButton. */
    class HydratedCallButton implements IHydratedCallButton {
        /**
         * Constructs a new HydratedCallButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHydratedCallButton)

        /** HydratedCallButton displayText. */
        public displayText: string

        /** HydratedCallButton phoneNumber. */
        public phoneNumber: string

        /**
         * Creates a new HydratedCallButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HydratedCallButton instance
         */
        public static create(properties?: proto.IHydratedCallButton): proto.HydratedCallButton

        /**
         * Encodes the specified HydratedCallButton message. Does not implicitly {@link proto.HydratedCallButton.verify|verify} messages.
         * @param message HydratedCallButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHydratedCallButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HydratedCallButton message, length delimited. Does not implicitly {@link proto.HydratedCallButton.verify|verify} messages.
         * @param message HydratedCallButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IHydratedCallButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a HydratedCallButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HydratedCallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HydratedCallButton

        /**
         * Decodes a HydratedCallButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HydratedCallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HydratedCallButton

        /**
         * Verifies a HydratedCallButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HydratedCallButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HydratedCallButton
         */
        public static fromObject(object: { [k: string]: any }): proto.HydratedCallButton

        /**
         * Creates a plain object from a HydratedCallButton message. Also converts values to other types if specified.
         * @param message HydratedCallButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HydratedCallButton,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HydratedCallButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HydratedTemplateButton. */
    interface IHydratedTemplateButton {
        /** HydratedTemplateButton index */
        index?: number | null

        /** HydratedTemplateButton quickReplyButton */
        quickReplyButton?: proto.IHydratedQuickReplyButton | null

        /** HydratedTemplateButton urlButton */
        urlButton?: proto.IHydratedURLButton | null

        /** HydratedTemplateButton callButton */
        callButton?: proto.IHydratedCallButton | null
    }

    /** Represents a HydratedTemplateButton. */
    class HydratedTemplateButton implements IHydratedTemplateButton {
        /**
         * Constructs a new HydratedTemplateButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHydratedTemplateButton)

        /** HydratedTemplateButton index. */
        public index: number

        /** HydratedTemplateButton quickReplyButton. */
        public quickReplyButton?: proto.IHydratedQuickReplyButton | null

        /** HydratedTemplateButton urlButton. */
        public urlButton?: proto.IHydratedURLButton | null

        /** HydratedTemplateButton callButton. */
        public callButton?: proto.IHydratedCallButton | null

        /** HydratedTemplateButton hydratedButton. */
        public hydratedButton?: 'quickReplyButton' | 'urlButton' | 'callButton'

        /**
         * Creates a new HydratedTemplateButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HydratedTemplateButton instance
         */
        public static create(properties?: proto.IHydratedTemplateButton): proto.HydratedTemplateButton

        /**
         * Encodes the specified HydratedTemplateButton message. Does not implicitly {@link proto.HydratedTemplateButton.verify|verify} messages.
         * @param message HydratedTemplateButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHydratedTemplateButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HydratedTemplateButton message, length delimited. Does not implicitly {@link proto.HydratedTemplateButton.verify|verify} messages.
         * @param message HydratedTemplateButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IHydratedTemplateButton,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a HydratedTemplateButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HydratedTemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HydratedTemplateButton

        /**
         * Decodes a HydratedTemplateButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HydratedTemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HydratedTemplateButton

        /**
         * Verifies a HydratedTemplateButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HydratedTemplateButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HydratedTemplateButton
         */
        public static fromObject(object: { [k: string]: any }): proto.HydratedTemplateButton

        /**
         * Creates a plain object from a HydratedTemplateButton message. Also converts values to other types if specified.
         * @param message HydratedTemplateButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HydratedTemplateButton,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HydratedTemplateButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a QuickReplyButton. */
    interface IQuickReplyButton {
        /** QuickReplyButton displayText */
        displayText?: proto.IHighlyStructuredMessage | null

        /** QuickReplyButton id */
        id?: string | null
    }

    /** Represents a QuickReplyButton. */
    class QuickReplyButton implements IQuickReplyButton {
        /**
         * Constructs a new QuickReplyButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IQuickReplyButton)

        /** QuickReplyButton displayText. */
        public displayText?: proto.IHighlyStructuredMessage | null

        /** QuickReplyButton id. */
        public id: string

        /**
         * Creates a new QuickReplyButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns QuickReplyButton instance
         */
        public static create(properties?: proto.IQuickReplyButton): proto.QuickReplyButton

        /**
         * Encodes the specified QuickReplyButton message. Does not implicitly {@link proto.QuickReplyButton.verify|verify} messages.
         * @param message QuickReplyButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IQuickReplyButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified QuickReplyButton message, length delimited. Does not implicitly {@link proto.QuickReplyButton.verify|verify} messages.
         * @param message QuickReplyButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IQuickReplyButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a QuickReplyButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns QuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.QuickReplyButton

        /**
         * Decodes a QuickReplyButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns QuickReplyButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.QuickReplyButton

        /**
         * Verifies a QuickReplyButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a QuickReplyButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns QuickReplyButton
         */
        public static fromObject(object: { [k: string]: any }): proto.QuickReplyButton

        /**
         * Creates a plain object from a QuickReplyButton message. Also converts values to other types if specified.
         * @param message QuickReplyButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.QuickReplyButton,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this QuickReplyButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a URLButton. */
    interface IURLButton {
        /** URLButton displayText */
        displayText?: proto.IHighlyStructuredMessage | null

        /** URLButton url */
        url?: proto.IHighlyStructuredMessage | null
    }

    /** Represents a URLButton. */
    class URLButton implements IURLButton {
        /**
         * Constructs a new URLButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IURLButton)

        /** URLButton displayText. */
        public displayText?: proto.IHighlyStructuredMessage | null

        /** URLButton url. */
        public url?: proto.IHighlyStructuredMessage | null

        /**
         * Creates a new URLButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns URLButton instance
         */
        public static create(properties?: proto.IURLButton): proto.URLButton

        /**
         * Encodes the specified URLButton message. Does not implicitly {@link proto.URLButton.verify|verify} messages.
         * @param message URLButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IURLButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified URLButton message, length delimited. Does not implicitly {@link proto.URLButton.verify|verify} messages.
         * @param message URLButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IURLButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a URLButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns URLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.URLButton

        /**
         * Decodes a URLButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns URLButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.URLButton

        /**
         * Verifies a URLButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a URLButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns URLButton
         */
        public static fromObject(object: { [k: string]: any }): proto.URLButton

        /**
         * Creates a plain object from a URLButton message. Also converts values to other types if specified.
         * @param message URLButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.URLButton, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this URLButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a CallButton. */
    interface ICallButton {
        /** CallButton displayText */
        displayText?: proto.IHighlyStructuredMessage | null

        /** CallButton phoneNumber */
        phoneNumber?: proto.IHighlyStructuredMessage | null
    }

    /** Represents a CallButton. */
    class CallButton implements ICallButton {
        /**
         * Constructs a new CallButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ICallButton)

        /** CallButton displayText. */
        public displayText?: proto.IHighlyStructuredMessage | null

        /** CallButton phoneNumber. */
        public phoneNumber?: proto.IHighlyStructuredMessage | null

        /**
         * Creates a new CallButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallButton instance
         */
        public static create(properties?: proto.ICallButton): proto.CallButton

        /**
         * Encodes the specified CallButton message. Does not implicitly {@link proto.CallButton.verify|verify} messages.
         * @param message CallButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ICallButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified CallButton message, length delimited. Does not implicitly {@link proto.CallButton.verify|verify} messages.
         * @param message CallButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ICallButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a CallButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.CallButton

        /**
         * Decodes a CallButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.CallButton

        /**
         * Verifies a CallButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a CallButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CallButton
         */
        public static fromObject(object: { [k: string]: any }): proto.CallButton

        /**
         * Creates a plain object from a CallButton message. Also converts values to other types if specified.
         * @param message CallButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.CallButton, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this CallButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a TemplateButton. */
    interface ITemplateButton {
        /** TemplateButton index */
        index?: number | null

        /** TemplateButton quickReplyButton */
        quickReplyButton?: proto.IQuickReplyButton | null

        /** TemplateButton urlButton */
        urlButton?: proto.IURLButton | null

        /** TemplateButton callButton */
        callButton?: proto.ICallButton | null
    }

    /** Represents a TemplateButton. */
    class TemplateButton implements ITemplateButton {
        /**
         * Constructs a new TemplateButton.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ITemplateButton)

        /** TemplateButton index. */
        public index: number

        /** TemplateButton quickReplyButton. */
        public quickReplyButton?: proto.IQuickReplyButton | null

        /** TemplateButton urlButton. */
        public urlButton?: proto.IURLButton | null

        /** TemplateButton callButton. */
        public callButton?: proto.ICallButton | null

        /** TemplateButton button. */
        public button?: 'quickReplyButton' | 'urlButton' | 'callButton'

        /**
         * Creates a new TemplateButton instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TemplateButton instance
         */
        public static create(properties?: proto.ITemplateButton): proto.TemplateButton

        /**
         * Encodes the specified TemplateButton message. Does not implicitly {@link proto.TemplateButton.verify|verify} messages.
         * @param message TemplateButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ITemplateButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified TemplateButton message, length delimited. Does not implicitly {@link proto.TemplateButton.verify|verify} messages.
         * @param message TemplateButton message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ITemplateButton, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a TemplateButton message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.TemplateButton

        /**
         * Decodes a TemplateButton message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TemplateButton
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.TemplateButton

        /**
         * Verifies a TemplateButton message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a TemplateButton message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TemplateButton
         */
        public static fromObject(object: { [k: string]: any }): proto.TemplateButton

        /**
         * Creates a plain object from a TemplateButton message. Also converts values to other types if specified.
         * @param message TemplateButton
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.TemplateButton,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this TemplateButton to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a Location. */
    interface ILocation {
        /** Location degreesLatitude */
        degreesLatitude?: number | null

        /** Location degreesLongitude */
        degreesLongitude?: number | null

        /** Location name */
        name?: string | null
    }

    /** Represents a Location. */
    class Location implements ILocation {
        /**
         * Constructs a new Location.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ILocation)

        /** Location degreesLatitude. */
        public degreesLatitude: number

        /** Location degreesLongitude. */
        public degreesLongitude: number

        /** Location name. */
        public name: string

        /**
         * Creates a new Location instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Location instance
         */
        public static create(properties?: proto.ILocation): proto.Location

        /**
         * Encodes the specified Location message. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @param message Location message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ILocation, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified Location message, length delimited. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @param message Location message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ILocation, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a Location message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Location

        /**
         * Decodes a Location message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Location

        /**
         * Verifies a Location message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a Location message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Location
         */
        public static fromObject(object: { [k: string]: any }): proto.Location

        /**
         * Creates a plain object from a Location message. Also converts values to other types if specified.
         * @param message Location
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Location, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this Location to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a Point. */
    interface IPoint {
        /** Point x */
        x?: number | null

        /** Point y */
        y?: number | null
    }

    /** Represents a Point. */
    class Point implements IPoint {
        /**
         * Constructs a new Point.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IPoint)

        /** Point x. */
        public x: number

        /** Point y. */
        public y: number

        /**
         * Creates a new Point instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Point instance
         */
        public static create(properties?: proto.IPoint): proto.Point

        /**
         * Encodes the specified Point message. Does not implicitly {@link proto.Point.verify|verify} messages.
         * @param message Point message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IPoint, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified Point message, length delimited. Does not implicitly {@link proto.Point.verify|verify} messages.
         * @param message Point message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IPoint, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a Point message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Point
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Point

        /**
         * Decodes a Point message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Point
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Point

        /**
         * Verifies a Point message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a Point message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Point
         */
        public static fromObject(object: { [k: string]: any }): proto.Point

        /**
         * Creates a plain object from a Point message. Also converts values to other types if specified.
         * @param message Point
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Point, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this Point to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of an InteractiveAnnotation. */
    interface IInteractiveAnnotation {
        /** InteractiveAnnotation polygonVertices */
        polygonVertices?: proto.IPoint[] | null

        /** InteractiveAnnotation location */
        location?: proto.ILocation | null
    }

    /** Represents an InteractiveAnnotation. */
    class InteractiveAnnotation implements IInteractiveAnnotation {
        /**
         * Constructs a new InteractiveAnnotation.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IInteractiveAnnotation)

        /** InteractiveAnnotation polygonVertices. */
        public polygonVertices: proto.IPoint[]

        /** InteractiveAnnotation location. */
        public location?: proto.ILocation | null

        /** InteractiveAnnotation action. */
        public action?: 'location'

        /**
         * Creates a new InteractiveAnnotation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InteractiveAnnotation instance
         */
        public static create(properties?: proto.IInteractiveAnnotation): proto.InteractiveAnnotation

        /**
         * Encodes the specified InteractiveAnnotation message. Does not implicitly {@link proto.InteractiveAnnotation.verify|verify} messages.
         * @param message InteractiveAnnotation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IInteractiveAnnotation, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified InteractiveAnnotation message, length delimited. Does not implicitly {@link proto.InteractiveAnnotation.verify|verify} messages.
         * @param message InteractiveAnnotation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IInteractiveAnnotation,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes an InteractiveAnnotation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InteractiveAnnotation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.InteractiveAnnotation

        /**
         * Decodes an InteractiveAnnotation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InteractiveAnnotation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.InteractiveAnnotation

        /**
         * Verifies an InteractiveAnnotation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates an InteractiveAnnotation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InteractiveAnnotation
         */
        public static fromObject(object: { [k: string]: any }): proto.InteractiveAnnotation

        /**
         * Creates a plain object from an InteractiveAnnotation message. Also converts values to other types if specified.
         * @param message InteractiveAnnotation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.InteractiveAnnotation,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this InteractiveAnnotation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of an AdReplyInfo. */
    interface IAdReplyInfo {
        /** AdReplyInfo advertiserName */
        advertiserName?: string | null

        /** AdReplyInfo mediaType */
        mediaType?: proto.AdReplyInfo.AD_REPLY_INFO_MEDIATYPE | null

        /** AdReplyInfo jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** AdReplyInfo caption */
        caption?: string | null
    }

    /** Represents an AdReplyInfo. */
    class AdReplyInfo implements IAdReplyInfo {
        /**
         * Constructs a new AdReplyInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IAdReplyInfo)

        /** AdReplyInfo advertiserName. */
        public advertiserName: string

        /** AdReplyInfo mediaType. */
        public mediaType: proto.AdReplyInfo.AD_REPLY_INFO_MEDIATYPE

        /** AdReplyInfo jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** AdReplyInfo caption. */
        public caption: string

        /**
         * Creates a new AdReplyInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdReplyInfo instance
         */
        public static create(properties?: proto.IAdReplyInfo): proto.AdReplyInfo

        /**
         * Encodes the specified AdReplyInfo message. Does not implicitly {@link proto.AdReplyInfo.verify|verify} messages.
         * @param message AdReplyInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IAdReplyInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified AdReplyInfo message, length delimited. Does not implicitly {@link proto.AdReplyInfo.verify|verify} messages.
         * @param message AdReplyInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IAdReplyInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes an AdReplyInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdReplyInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.AdReplyInfo

        /**
         * Decodes an AdReplyInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdReplyInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.AdReplyInfo

        /**
         * Verifies an AdReplyInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates an AdReplyInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdReplyInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.AdReplyInfo

        /**
         * Creates a plain object from an AdReplyInfo message. Also converts values to other types if specified.
         * @param message AdReplyInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.AdReplyInfo, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this AdReplyInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace AdReplyInfo {
        /** AD_REPLY_INFO_MEDIATYPE enum. */
        enum AD_REPLY_INFO_MEDIATYPE {
            NONE = 0,
            IMAGE = 1,
            VIDEO = 2,
        }
    }

    /** Properties of a ContextInfo. */
    interface IContextInfo {
        /** ContextInfo stanzaId */
        stanzaId?: string | null

        /** ContextInfo participant */
        participant?: string | null

        /** ContextInfo quotedMessage */
        quotedMessage?: proto.IMessage | null

        /** ContextInfo remoteJid */
        remoteJid?: string | null

        /** ContextInfo mentionedJid */
        mentionedJid?: string[] | null

        /** ContextInfo conversionSource */
        conversionSource?: string | null

        /** ContextInfo conversionData */
        conversionData?: Uint8Array | null

        /** ContextInfo conversionDelaySeconds */
        conversionDelaySeconds?: number | null

        /** ContextInfo forwardingScore */
        forwardingScore?: number | null

        /** ContextInfo isForwarded */
        isForwarded?: boolean | null

        /** ContextInfo quotedAd */
        quotedAd?: proto.IAdReplyInfo | null

        /** ContextInfo placeholderKey */
        placeholderKey?: proto.IMessageKey | null

        /** ContextInfo expiration */
        expiration?: number | null
    }

    /** Represents a ContextInfo. */
    class ContextInfo implements IContextInfo {
        /**
         * Constructs a new ContextInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IContextInfo)

        /** ContextInfo stanzaId. */
        public stanzaId: string

        /** ContextInfo participant. */
        public participant: string

        /** ContextInfo quotedMessage. */
        public quotedMessage?: proto.IMessage | null

        /** ContextInfo remoteJid. */
        public remoteJid: string

        /** ContextInfo mentionedJid. */
        public mentionedJid: string[]

        /** ContextInfo conversionSource. */
        public conversionSource: string

        /** ContextInfo conversionData. */
        public conversionData: Uint8Array

        /** ContextInfo conversionDelaySeconds. */
        public conversionDelaySeconds: number

        /** ContextInfo forwardingScore. */
        public forwardingScore: number

        /** ContextInfo isForwarded. */
        public isForwarded: boolean

        /** ContextInfo quotedAd. */
        public quotedAd?: proto.IAdReplyInfo | null

        /** ContextInfo placeholderKey. */
        public placeholderKey?: proto.IMessageKey | null

        /** ContextInfo expiration. */
        public expiration: number

        /**
         * Creates a new ContextInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContextInfo instance
         */
        public static create(properties?: proto.IContextInfo): proto.ContextInfo

        /**
         * Encodes the specified ContextInfo message. Does not implicitly {@link proto.ContextInfo.verify|verify} messages.
         * @param message ContextInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IContextInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ContextInfo message, length delimited. Does not implicitly {@link proto.ContextInfo.verify|verify} messages.
         * @param message ContextInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IContextInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a ContextInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContextInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ContextInfo

        /**
         * Decodes a ContextInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContextInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ContextInfo

        /**
         * Verifies a ContextInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a ContextInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContextInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.ContextInfo

        /**
         * Creates a plain object from a ContextInfo message. Also converts values to other types if specified.
         * @param message ContextInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.ContextInfo, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this ContextInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a SenderKeyDistributionMessage. */
    interface ISenderKeyDistributionMessage {
        /** SenderKeyDistributionMessage groupId */
        groupId?: string | null

        /** SenderKeyDistributionMessage axolotlSenderKeyDistributionMessage */
        axolotlSenderKeyDistributionMessage?: Uint8Array | null
    }

    /** Represents a SenderKeyDistributionMessage. */
    class SenderKeyDistributionMessage implements ISenderKeyDistributionMessage {
        /**
         * Constructs a new SenderKeyDistributionMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISenderKeyDistributionMessage)

        /** SenderKeyDistributionMessage groupId. */
        public groupId: string

        /** SenderKeyDistributionMessage axolotlSenderKeyDistributionMessage. */
        public axolotlSenderKeyDistributionMessage: Uint8Array

        /**
         * Creates a new SenderKeyDistributionMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SenderKeyDistributionMessage instance
         */
        public static create(properties?: proto.ISenderKeyDistributionMessage): proto.SenderKeyDistributionMessage

        /**
         * Encodes the specified SenderKeyDistributionMessage message. Does not implicitly {@link proto.SenderKeyDistributionMessage.verify|verify} messages.
         * @param message SenderKeyDistributionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISenderKeyDistributionMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified SenderKeyDistributionMessage message, length delimited. Does not implicitly {@link proto.SenderKeyDistributionMessage.verify|verify} messages.
         * @param message SenderKeyDistributionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.ISenderKeyDistributionMessage,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a SenderKeyDistributionMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SenderKeyDistributionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.SenderKeyDistributionMessage

        /**
         * Decodes a SenderKeyDistributionMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SenderKeyDistributionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.SenderKeyDistributionMessage

        /**
         * Verifies a SenderKeyDistributionMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a SenderKeyDistributionMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SenderKeyDistributionMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.SenderKeyDistributionMessage

        /**
         * Creates a plain object from a SenderKeyDistributionMessage message. Also converts values to other types if specified.
         * @param message SenderKeyDistributionMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.SenderKeyDistributionMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this SenderKeyDistributionMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of an ImageMessage. */
    interface IImageMessage {
        /** ImageMessage url */
        url?: string | null

        /** ImageMessage mimetype */
        mimetype?: string | null

        /** ImageMessage caption */
        caption?: string | null

        /** ImageMessage fileSha256 */
        fileSha256?: Uint8Array | null

        /** ImageMessage fileLength */
        fileLength?: number | Long | null

        /** ImageMessage height */
        height?: number | null

        /** ImageMessage width */
        width?: number | null

        /** ImageMessage mediaKey */
        mediaKey?: Uint8Array | null

        /** ImageMessage fileEncSha256 */
        fileEncSha256?: Uint8Array | null

        /** ImageMessage interactiveAnnotations */
        interactiveAnnotations?: proto.IInteractiveAnnotation[] | null

        /** ImageMessage directPath */
        directPath?: string | null

        /** ImageMessage mediaKeyTimestamp */
        mediaKeyTimestamp?: number | Long | null

        /** ImageMessage jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** ImageMessage contextInfo */
        contextInfo?: proto.IContextInfo | null

        /** ImageMessage firstScanSidecar */
        firstScanSidecar?: Uint8Array | null

        /** ImageMessage firstScanLength */
        firstScanLength?: number | null

        /** ImageMessage experimentGroupId */
        experimentGroupId?: number | null

        /** ImageMessage scansSidecar */
        scansSidecar?: Uint8Array | null

        /** ImageMessage scanLengths */
        scanLengths?: number[] | null

        /** ImageMessage midQualityFileSha256 */
        midQualityFileSha256?: Uint8Array | null

        /** ImageMessage midQualityFileEncSha256 */
        midQualityFileEncSha256?: Uint8Array | null
    }

    /** Represents an ImageMessage. */
    class ImageMessage implements IImageMessage {
        /**
         * Constructs a new ImageMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IImageMessage)

        /** ImageMessage url. */
        public url: string

        /** ImageMessage mimetype. */
        public mimetype: string

        /** ImageMessage caption. */
        public caption: string

        /** ImageMessage fileSha256. */
        public fileSha256: Uint8Array

        /** ImageMessage fileLength. */
        public fileLength: number | Long

        /** ImageMessage height. */
        public height: number

        /** ImageMessage width. */
        public width: number

        /** ImageMessage mediaKey. */
        public mediaKey: Uint8Array

        /** ImageMessage fileEncSha256. */
        public fileEncSha256: Uint8Array

        /** ImageMessage interactiveAnnotations. */
        public interactiveAnnotations: proto.IInteractiveAnnotation[]

        /** ImageMessage directPath. */
        public directPath: string

        /** ImageMessage mediaKeyTimestamp. */
        public mediaKeyTimestamp: number | Long

        /** ImageMessage jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** ImageMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /** ImageMessage firstScanSidecar. */
        public firstScanSidecar: Uint8Array

        /** ImageMessage firstScanLength. */
        public firstScanLength: number

        /** ImageMessage experimentGroupId. */
        public experimentGroupId: number

        /** ImageMessage scansSidecar. */
        public scansSidecar: Uint8Array

        /** ImageMessage scanLengths. */
        public scanLengths: number[]

        /** ImageMessage midQualityFileSha256. */
        public midQualityFileSha256: Uint8Array

        /** ImageMessage midQualityFileEncSha256. */
        public midQualityFileEncSha256: Uint8Array

        /**
         * Creates a new ImageMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ImageMessage instance
         */
        public static create(properties?: proto.IImageMessage): proto.ImageMessage

        /**
         * Encodes the specified ImageMessage message. Does not implicitly {@link proto.ImageMessage.verify|verify} messages.
         * @param message ImageMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IImageMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ImageMessage message, length delimited. Does not implicitly {@link proto.ImageMessage.verify|verify} messages.
         * @param message ImageMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IImageMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes an ImageMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ImageMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ImageMessage

        /**
         * Decodes an ImageMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ImageMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ImageMessage

        /**
         * Verifies an ImageMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates an ImageMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ImageMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.ImageMessage

        /**
         * Creates a plain object from an ImageMessage message. Also converts values to other types if specified.
         * @param message ImageMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.ImageMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this ImageMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a ContactMessage. */
    interface IContactMessage {
        /** ContactMessage displayName */
        displayName?: string | null

        /** ContactMessage vcard */
        vcard?: string | null

        /** ContactMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a ContactMessage. */
    class ContactMessage implements IContactMessage {
        /**
         * Constructs a new ContactMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IContactMessage)

        /** ContactMessage displayName. */
        public displayName: string

        /** ContactMessage vcard. */
        public vcard: string

        /** ContactMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new ContactMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactMessage instance
         */
        public static create(properties?: proto.IContactMessage): proto.ContactMessage

        /**
         * Encodes the specified ContactMessage message. Does not implicitly {@link proto.ContactMessage.verify|verify} messages.
         * @param message ContactMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IContactMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ContactMessage message, length delimited. Does not implicitly {@link proto.ContactMessage.verify|verify} messages.
         * @param message ContactMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IContactMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a ContactMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ContactMessage

        /**
         * Decodes a ContactMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ContactMessage

        /**
         * Verifies a ContactMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a ContactMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.ContactMessage

        /**
         * Creates a plain object from a ContactMessage message. Also converts values to other types if specified.
         * @param message ContactMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.ContactMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this ContactMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a LocationMessage. */
    interface ILocationMessage {
        /** LocationMessage degreesLatitude */
        degreesLatitude?: number | null

        /** LocationMessage degreesLongitude */
        degreesLongitude?: number | null

        /** LocationMessage name */
        name?: string | null

        /** LocationMessage address */
        address?: string | null

        /** LocationMessage url */
        url?: string | null

        /** LocationMessage jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** LocationMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a LocationMessage. */
    class LocationMessage implements ILocationMessage {
        /**
         * Constructs a new LocationMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ILocationMessage)

        /** LocationMessage degreesLatitude. */
        public degreesLatitude: number

        /** LocationMessage degreesLongitude. */
        public degreesLongitude: number

        /** LocationMessage name. */
        public name: string

        /** LocationMessage address. */
        public address: string

        /** LocationMessage url. */
        public url: string

        /** LocationMessage jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** LocationMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new LocationMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LocationMessage instance
         */
        public static create(properties?: proto.ILocationMessage): proto.LocationMessage

        /**
         * Encodes the specified LocationMessage message. Does not implicitly {@link proto.LocationMessage.verify|verify} messages.
         * @param message LocationMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ILocationMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified LocationMessage message, length delimited. Does not implicitly {@link proto.LocationMessage.verify|verify} messages.
         * @param message LocationMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ILocationMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a LocationMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.LocationMessage

        /**
         * Decodes a LocationMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.LocationMessage

        /**
         * Verifies a LocationMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a LocationMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LocationMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.LocationMessage

        /**
         * Creates a plain object from a LocationMessage message. Also converts values to other types if specified.
         * @param message LocationMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.LocationMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this LocationMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of an ExtendedTextMessage. */
    interface IExtendedTextMessage {
        /** ExtendedTextMessage text */
        text?: string | null

        /** ExtendedTextMessage matchedText */
        matchedText?: string | null

        /** ExtendedTextMessage canonicalUrl */
        canonicalUrl?: string | null

        /** ExtendedTextMessage description */
        description?: string | null

        /** ExtendedTextMessage title */
        title?: string | null

        /** ExtendedTextMessage textArgb */
        textArgb?: number | null

        /** ExtendedTextMessage backgroundArgb */
        backgroundArgb?: number | null

        /** ExtendedTextMessage font */
        font?: proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_FONTTYPE | null

        /** ExtendedTextMessage previewType */
        previewType?: proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_PREVIEWTYPE | null

        /** ExtendedTextMessage jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** ExtendedTextMessage contextInfo */
        contextInfo?: proto.IContextInfo | null

        /** ExtendedTextMessage doNotPlayInline */
        doNotPlayInline?: boolean | null
    }

    /** Represents an ExtendedTextMessage. */
    class ExtendedTextMessage implements IExtendedTextMessage {
        /**
         * Constructs a new ExtendedTextMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IExtendedTextMessage)

        /** ExtendedTextMessage text. */
        public text: string

        /** ExtendedTextMessage matchedText. */
        public matchedText: string

        /** ExtendedTextMessage canonicalUrl. */
        public canonicalUrl: string

        /** ExtendedTextMessage description. */
        public description: string

        /** ExtendedTextMessage title. */
        public title: string

        /** ExtendedTextMessage textArgb. */
        public textArgb: number

        /** ExtendedTextMessage backgroundArgb. */
        public backgroundArgb: number

        /** ExtendedTextMessage font. */
        public font: proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_FONTTYPE

        /** ExtendedTextMessage previewType. */
        public previewType: proto.ExtendedTextMessage.EXTENDED_TEXT_MESSAGE_PREVIEWTYPE

        /** ExtendedTextMessage jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** ExtendedTextMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /** ExtendedTextMessage doNotPlayInline. */
        public doNotPlayInline: boolean

        /**
         * Creates a new ExtendedTextMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExtendedTextMessage instance
         */
        public static create(properties?: proto.IExtendedTextMessage): proto.ExtendedTextMessage

        /**
         * Encodes the specified ExtendedTextMessage message. Does not implicitly {@link proto.ExtendedTextMessage.verify|verify} messages.
         * @param message ExtendedTextMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IExtendedTextMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ExtendedTextMessage message, length delimited. Does not implicitly {@link proto.ExtendedTextMessage.verify|verify} messages.
         * @param message ExtendedTextMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IExtendedTextMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes an ExtendedTextMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExtendedTextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ExtendedTextMessage

        /**
         * Decodes an ExtendedTextMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExtendedTextMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ExtendedTextMessage

        /**
         * Verifies an ExtendedTextMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates an ExtendedTextMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExtendedTextMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.ExtendedTextMessage

        /**
         * Creates a plain object from an ExtendedTextMessage message. Also converts values to other types if specified.
         * @param message ExtendedTextMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.ExtendedTextMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this ExtendedTextMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace ExtendedTextMessage {
        /** EXTENDED_TEXT_MESSAGE_FONTTYPE enum. */
        enum EXTENDED_TEXT_MESSAGE_FONTTYPE {
            SANS_SERIF = 0,
            SERIF = 1,
            NORICAN_REGULAR = 2,
            BRYNDAN_WRITE = 3,
            BEBASNEUE_REGULAR = 4,
            OSWALD_HEAVY = 5,
        }

        /** EXTENDED_TEXT_MESSAGE_PREVIEWTYPE enum. */
        enum EXTENDED_TEXT_MESSAGE_PREVIEWTYPE {
            NONE = 0,
            VIDEO = 1,
        }
    }

    /** Properties of a DocumentMessage. */
    interface IDocumentMessage {
        /** DocumentMessage url */
        url?: string | null

        /** DocumentMessage mimetype */
        mimetype?: string | null

        /** DocumentMessage title */
        title?: string | null

        /** DocumentMessage fileSha256 */
        fileSha256?: Uint8Array | null

        /** DocumentMessage fileLength */
        fileLength?: number | Long | null

        /** DocumentMessage pageCount */
        pageCount?: number | null

        /** DocumentMessage mediaKey */
        mediaKey?: Uint8Array | null

        /** DocumentMessage fileName */
        fileName?: string | null

        /** DocumentMessage fileEncSha256 */
        fileEncSha256?: Uint8Array | null

        /** DocumentMessage directPath */
        directPath?: string | null

        /** DocumentMessage mediaKeyTimestamp */
        mediaKeyTimestamp?: number | Long | null

        /** DocumentMessage jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** DocumentMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a DocumentMessage. */
    class DocumentMessage implements IDocumentMessage {
        /**
         * Constructs a new DocumentMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IDocumentMessage)

        /** DocumentMessage url. */
        public url: string

        /** DocumentMessage mimetype. */
        public mimetype: string

        /** DocumentMessage title. */
        public title: string

        /** DocumentMessage fileSha256. */
        public fileSha256: Uint8Array

        /** DocumentMessage fileLength. */
        public fileLength: number | Long

        /** DocumentMessage pageCount. */
        public pageCount: number

        /** DocumentMessage mediaKey. */
        public mediaKey: Uint8Array

        /** DocumentMessage fileName. */
        public fileName: string

        /** DocumentMessage fileEncSha256. */
        public fileEncSha256: Uint8Array

        /** DocumentMessage directPath. */
        public directPath: string

        /** DocumentMessage mediaKeyTimestamp. */
        public mediaKeyTimestamp: number | Long

        /** DocumentMessage jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** DocumentMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new DocumentMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DocumentMessage instance
         */
        public static create(properties?: proto.IDocumentMessage): proto.DocumentMessage

        /**
         * Encodes the specified DocumentMessage message. Does not implicitly {@link proto.DocumentMessage.verify|verify} messages.
         * @param message DocumentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IDocumentMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified DocumentMessage message, length delimited. Does not implicitly {@link proto.DocumentMessage.verify|verify} messages.
         * @param message DocumentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IDocumentMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a DocumentMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DocumentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.DocumentMessage

        /**
         * Decodes a DocumentMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DocumentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.DocumentMessage

        /**
         * Verifies a DocumentMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a DocumentMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DocumentMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.DocumentMessage

        /**
         * Creates a plain object from a DocumentMessage message. Also converts values to other types if specified.
         * @param message DocumentMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.DocumentMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this DocumentMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of an AudioMessage. */
    interface IAudioMessage {
        /** AudioMessage url */
        url?: string | null

        /** AudioMessage mimetype */
        mimetype?: string | null

        /** AudioMessage fileSha256 */
        fileSha256?: Uint8Array | null

        /** AudioMessage fileLength */
        fileLength?: number | Long | null

        /** AudioMessage seconds */
        seconds?: number | null

        /** AudioMessage ptt */
        ptt?: boolean | null

        /** AudioMessage mediaKey */
        mediaKey?: Uint8Array | null

        /** AudioMessage fileEncSha256 */
        fileEncSha256?: Uint8Array | null

        /** AudioMessage directPath */
        directPath?: string | null

        /** AudioMessage mediaKeyTimestamp */
        mediaKeyTimestamp?: number | Long | null

        /** AudioMessage contextInfo */
        contextInfo?: proto.IContextInfo | null

        /** AudioMessage streamingSidecar */
        streamingSidecar?: Uint8Array | null
    }

    /** Represents an AudioMessage. */
    class AudioMessage implements IAudioMessage {
        /**
         * Constructs a new AudioMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IAudioMessage)

        /** AudioMessage url. */
        public url: string

        /** AudioMessage mimetype. */
        public mimetype: string

        /** AudioMessage fileSha256. */
        public fileSha256: Uint8Array

        /** AudioMessage fileLength. */
        public fileLength: number | Long

        /** AudioMessage seconds. */
        public seconds: number

        /** AudioMessage ptt. */
        public ptt: boolean

        /** AudioMessage mediaKey. */
        public mediaKey: Uint8Array

        /** AudioMessage fileEncSha256. */
        public fileEncSha256: Uint8Array

        /** AudioMessage directPath. */
        public directPath: string

        /** AudioMessage mediaKeyTimestamp. */
        public mediaKeyTimestamp: number | Long

        /** AudioMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /** AudioMessage streamingSidecar. */
        public streamingSidecar: Uint8Array

        /**
         * Creates a new AudioMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AudioMessage instance
         */
        public static create(properties?: proto.IAudioMessage): proto.AudioMessage

        /**
         * Encodes the specified AudioMessage message. Does not implicitly {@link proto.AudioMessage.verify|verify} messages.
         * @param message AudioMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IAudioMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified AudioMessage message, length delimited. Does not implicitly {@link proto.AudioMessage.verify|verify} messages.
         * @param message AudioMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IAudioMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes an AudioMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AudioMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.AudioMessage

        /**
         * Decodes an AudioMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AudioMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.AudioMessage

        /**
         * Verifies an AudioMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates an AudioMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AudioMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.AudioMessage

        /**
         * Creates a plain object from an AudioMessage message. Also converts values to other types if specified.
         * @param message AudioMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.AudioMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this AudioMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a VideoMessage. */
    interface IVideoMessage {
        /** VideoMessage url */
        url?: string | null

        /** VideoMessage mimetype */
        mimetype?: string | null

        /** VideoMessage fileSha256 */
        fileSha256?: Uint8Array | null

        /** VideoMessage fileLength */
        fileLength?: number | Long | null

        /** VideoMessage seconds */
        seconds?: number | null

        /** VideoMessage mediaKey */
        mediaKey?: Uint8Array | null

        /** VideoMessage caption */
        caption?: string | null

        /** VideoMessage gifPlayback */
        gifPlayback?: boolean | null

        /** VideoMessage height */
        height?: number | null

        /** VideoMessage width */
        width?: number | null

        /** VideoMessage fileEncSha256 */
        fileEncSha256?: Uint8Array | null

        /** VideoMessage interactiveAnnotations */
        interactiveAnnotations?: proto.IInteractiveAnnotation[] | null

        /** VideoMessage directPath */
        directPath?: string | null

        /** VideoMessage mediaKeyTimestamp */
        mediaKeyTimestamp?: number | Long | null

        /** VideoMessage jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** VideoMessage contextInfo */
        contextInfo?: proto.IContextInfo | null

        /** VideoMessage streamingSidecar */
        streamingSidecar?: Uint8Array | null

        /** VideoMessage gifAttribution */
        gifAttribution?: proto.VideoMessage.VIDEO_MESSAGE_ATTRIBUTION | null
    }

    /** Represents a VideoMessage. */
    class VideoMessage implements IVideoMessage {
        /**
         * Constructs a new VideoMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IVideoMessage)

        /** VideoMessage url. */
        public url: string

        /** VideoMessage mimetype. */
        public mimetype: string

        /** VideoMessage fileSha256. */
        public fileSha256: Uint8Array

        /** VideoMessage fileLength. */
        public fileLength: number | Long

        /** VideoMessage seconds. */
        public seconds: number

        /** VideoMessage mediaKey. */
        public mediaKey: Uint8Array

        /** VideoMessage caption. */
        public caption: string

        /** VideoMessage gifPlayback. */
        public gifPlayback: boolean

        /** VideoMessage height. */
        public height: number

        /** VideoMessage width. */
        public width: number

        /** VideoMessage fileEncSha256. */
        public fileEncSha256: Uint8Array

        /** VideoMessage interactiveAnnotations. */
        public interactiveAnnotations: proto.IInteractiveAnnotation[]

        /** VideoMessage directPath. */
        public directPath: string

        /** VideoMessage mediaKeyTimestamp. */
        public mediaKeyTimestamp: number | Long

        /** VideoMessage jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** VideoMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /** VideoMessage streamingSidecar. */
        public streamingSidecar: Uint8Array

        /** VideoMessage gifAttribution. */
        public gifAttribution: proto.VideoMessage.VIDEO_MESSAGE_ATTRIBUTION

        /**
         * Creates a new VideoMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VideoMessage instance
         */
        public static create(properties?: proto.IVideoMessage): proto.VideoMessage

        /**
         * Encodes the specified VideoMessage message. Does not implicitly {@link proto.VideoMessage.verify|verify} messages.
         * @param message VideoMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IVideoMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified VideoMessage message, length delimited. Does not implicitly {@link proto.VideoMessage.verify|verify} messages.
         * @param message VideoMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IVideoMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a VideoMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VideoMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.VideoMessage

        /**
         * Decodes a VideoMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VideoMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.VideoMessage

        /**
         * Verifies a VideoMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a VideoMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VideoMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.VideoMessage

        /**
         * Creates a plain object from a VideoMessage message. Also converts values to other types if specified.
         * @param message VideoMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.VideoMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this VideoMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace VideoMessage {
        /** VIDEO_MESSAGE_ATTRIBUTION enum. */
        enum VIDEO_MESSAGE_ATTRIBUTION {
            NONE = 0,
            GIPHY = 1,
            TENOR = 2,
        }
    }

    /** Properties of a Call. */
    interface ICall {
        /** Call callKey */
        callKey?: Uint8Array | null
    }

    /** Represents a Call. */
    class Call implements ICall {
        /**
         * Constructs a new Call.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ICall)

        /** Call callKey. */
        public callKey: Uint8Array

        /**
         * Creates a new Call instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Call instance
         */
        public static create(properties?: proto.ICall): proto.Call

        /**
         * Encodes the specified Call message. Does not implicitly {@link proto.Call.verify|verify} messages.
         * @param message Call message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ICall, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified Call message, length delimited. Does not implicitly {@link proto.Call.verify|verify} messages.
         * @param message Call message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ICall, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a Call message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Call
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Call

        /**
         * Decodes a Call message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Call
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Call

        /**
         * Verifies a Call message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a Call message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Call
         */
        public static fromObject(object: { [k: string]: any }): proto.Call

        /**
         * Creates a plain object from a Call message. Also converts values to other types if specified.
         * @param message Call
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Call, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this Call to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a Chat. */
    interface IChat {
        /** Chat displayName */
        displayName?: string | null

        /** Chat id */
        id?: string | null
    }

    /** Represents a Chat. */
    class Chat implements IChat {
        /**
         * Constructs a new Chat.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IChat)

        /** Chat displayName. */
        public displayName: string

        /** Chat id. */
        public id: string

        /**
         * Creates a new Chat instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Chat instance
         */
        public static create(properties?: proto.IChat): proto.Chat

        /**
         * Encodes the specified Chat message. Does not implicitly {@link proto.Chat.verify|verify} messages.
         * @param message Chat message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IChat, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified Chat message, length delimited. Does not implicitly {@link proto.Chat.verify|verify} messages.
         * @param message Chat message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IChat, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a Chat message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Chat
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Chat

        /**
         * Decodes a Chat message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Chat
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Chat

        /**
         * Verifies a Chat message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a Chat message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Chat
         */
        public static fromObject(object: { [k: string]: any }): proto.Chat

        /**
         * Creates a plain object from a Chat message. Also converts values to other types if specified.
         * @param message Chat
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Chat, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this Chat to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a ProtocolMessage. */
    interface IProtocolMessage {
        /** ProtocolMessage key */
        key?: proto.IMessageKey | null

        /** ProtocolMessage type */
        type?: proto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE | null

        /** ProtocolMessage ephemeralExpiration */
        ephemeralExpiration?: number | null
    }

    /** Represents a ProtocolMessage. */
    class ProtocolMessage implements IProtocolMessage {
        /**
         * Constructs a new ProtocolMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IProtocolMessage)

        /** ProtocolMessage key. */
        public key?: proto.IMessageKey | null

        /** ProtocolMessage type. */
        public type: proto.ProtocolMessage.PROTOCOL_MESSAGE_TYPE

        /** ProtocolMessage ephemeralExpiration. */
        public ephemeralExpiration: number

        /**
         * Creates a new ProtocolMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProtocolMessage instance
         */
        public static create(properties?: proto.IProtocolMessage): proto.ProtocolMessage

        /**
         * Encodes the specified ProtocolMessage message. Does not implicitly {@link proto.ProtocolMessage.verify|verify} messages.
         * @param message ProtocolMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IProtocolMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ProtocolMessage message, length delimited. Does not implicitly {@link proto.ProtocolMessage.verify|verify} messages.
         * @param message ProtocolMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IProtocolMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a ProtocolMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProtocolMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ProtocolMessage

        /**
         * Decodes a ProtocolMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProtocolMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ProtocolMessage

        /**
         * Verifies a ProtocolMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a ProtocolMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProtocolMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.ProtocolMessage

        /**
         * Creates a plain object from a ProtocolMessage message. Also converts values to other types if specified.
         * @param message ProtocolMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.ProtocolMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this ProtocolMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace ProtocolMessage {
        /** PROTOCOL_MESSAGE_TYPE enum. */
        enum PROTOCOL_MESSAGE_TYPE {
            REVOKE = 0,
            EPHEMERAL_SETTING = 3,
        }
    }

    /** Properties of a ContactsArrayMessage. */
    interface IContactsArrayMessage {
        /** ContactsArrayMessage displayName */
        displayName?: string | null

        /** ContactsArrayMessage contacts */
        contacts?: proto.IContactMessage[] | null

        /** ContactsArrayMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a ContactsArrayMessage. */
    class ContactsArrayMessage implements IContactsArrayMessage {
        /**
         * Constructs a new ContactsArrayMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IContactsArrayMessage)

        /** ContactsArrayMessage displayName. */
        public displayName: string

        /** ContactsArrayMessage contacts. */
        public contacts: proto.IContactMessage[]

        /** ContactsArrayMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new ContactsArrayMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactsArrayMessage instance
         */
        public static create(properties?: proto.IContactsArrayMessage): proto.ContactsArrayMessage

        /**
         * Encodes the specified ContactsArrayMessage message. Does not implicitly {@link proto.ContactsArrayMessage.verify|verify} messages.
         * @param message ContactsArrayMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IContactsArrayMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ContactsArrayMessage message, length delimited. Does not implicitly {@link proto.ContactsArrayMessage.verify|verify} messages.
         * @param message ContactsArrayMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IContactsArrayMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a ContactsArrayMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactsArrayMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ContactsArrayMessage

        /**
         * Decodes a ContactsArrayMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactsArrayMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ContactsArrayMessage

        /**
         * Verifies a ContactsArrayMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a ContactsArrayMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactsArrayMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.ContactsArrayMessage

        /**
         * Creates a plain object from a ContactsArrayMessage message. Also converts values to other types if specified.
         * @param message ContactsArrayMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.ContactsArrayMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this ContactsArrayMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HSMCurrency. */
    interface IHSMCurrency {
        /** HSMCurrency currencyCode */
        currencyCode?: string | null

        /** HSMCurrency amount1000 */
        amount1000?: number | Long | null
    }

    /** Represents a HSMCurrency. */
    class HSMCurrency implements IHSMCurrency {
        /**
         * Constructs a new HSMCurrency.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHSMCurrency)

        /** HSMCurrency currencyCode. */
        public currencyCode: string

        /** HSMCurrency amount1000. */
        public amount1000: number | Long

        /**
         * Creates a new HSMCurrency instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HSMCurrency instance
         */
        public static create(properties?: proto.IHSMCurrency): proto.HSMCurrency

        /**
         * Encodes the specified HSMCurrency message. Does not implicitly {@link proto.HSMCurrency.verify|verify} messages.
         * @param message HSMCurrency message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHSMCurrency, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HSMCurrency message, length delimited. Does not implicitly {@link proto.HSMCurrency.verify|verify} messages.
         * @param message HSMCurrency message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IHSMCurrency, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a HSMCurrency message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HSMCurrency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HSMCurrency

        /**
         * Decodes a HSMCurrency message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HSMCurrency
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HSMCurrency

        /**
         * Verifies a HSMCurrency message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HSMCurrency message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HSMCurrency
         */
        public static fromObject(object: { [k: string]: any }): proto.HSMCurrency

        /**
         * Creates a plain object from a HSMCurrency message. Also converts values to other types if specified.
         * @param message HSMCurrency
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.HSMCurrency, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this HSMCurrency to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HSMDateTimeComponent. */
    interface IHSMDateTimeComponent {
        /** HSMDateTimeComponent dayOfWeek */
        dayOfWeek?: proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE | null

        /** HSMDateTimeComponent year */
        year?: number | null

        /** HSMDateTimeComponent month */
        month?: number | null

        /** HSMDateTimeComponent dayOfMonth */
        dayOfMonth?: number | null

        /** HSMDateTimeComponent hour */
        hour?: number | null

        /** HSMDateTimeComponent minute */
        minute?: number | null

        /** HSMDateTimeComponent calendar */
        calendar?: proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_CALENDARTYPE | null
    }

    /** Represents a HSMDateTimeComponent. */
    class HSMDateTimeComponent implements IHSMDateTimeComponent {
        /**
         * Constructs a new HSMDateTimeComponent.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHSMDateTimeComponent)

        /** HSMDateTimeComponent dayOfWeek. */
        public dayOfWeek: proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE

        /** HSMDateTimeComponent year. */
        public year: number

        /** HSMDateTimeComponent month. */
        public month: number

        /** HSMDateTimeComponent dayOfMonth. */
        public dayOfMonth: number

        /** HSMDateTimeComponent hour. */
        public hour: number

        /** HSMDateTimeComponent minute. */
        public minute: number

        /** HSMDateTimeComponent calendar. */
        public calendar: proto.HSMDateTimeComponent.HSM_DATE_TIME_COMPONENT_CALENDARTYPE

        /**
         * Creates a new HSMDateTimeComponent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HSMDateTimeComponent instance
         */
        public static create(properties?: proto.IHSMDateTimeComponent): proto.HSMDateTimeComponent

        /**
         * Encodes the specified HSMDateTimeComponent message. Does not implicitly {@link proto.HSMDateTimeComponent.verify|verify} messages.
         * @param message HSMDateTimeComponent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHSMDateTimeComponent, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HSMDateTimeComponent message, length delimited. Does not implicitly {@link proto.HSMDateTimeComponent.verify|verify} messages.
         * @param message HSMDateTimeComponent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IHSMDateTimeComponent, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a HSMDateTimeComponent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HSMDateTimeComponent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HSMDateTimeComponent

        /**
         * Decodes a HSMDateTimeComponent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HSMDateTimeComponent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HSMDateTimeComponent

        /**
         * Verifies a HSMDateTimeComponent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HSMDateTimeComponent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HSMDateTimeComponent
         */
        public static fromObject(object: { [k: string]: any }): proto.HSMDateTimeComponent

        /**
         * Creates a plain object from a HSMDateTimeComponent message. Also converts values to other types if specified.
         * @param message HSMDateTimeComponent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HSMDateTimeComponent,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HSMDateTimeComponent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace HSMDateTimeComponent {
        /** HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE enum. */
        enum HSM_DATE_TIME_COMPONENT_DAYOFWEEKTYPE {
            MONDAY = 1,
            TUESDAY = 2,
            WEDNESDAY = 3,
            THURSDAY = 4,
            FRIDAY = 5,
            SATURDAY = 6,
            SUNDAY = 7,
        }

        /** HSM_DATE_TIME_COMPONENT_CALENDARTYPE enum. */
        enum HSM_DATE_TIME_COMPONENT_CALENDARTYPE {
            GREGORIAN = 1,
            SOLAR_HIJRI = 2,
        }
    }

    /** Properties of a HSMDateTimeUnixEpoch. */
    interface IHSMDateTimeUnixEpoch {
        /** HSMDateTimeUnixEpoch timestamp */
        timestamp?: number | Long | null
    }

    /** Represents a HSMDateTimeUnixEpoch. */
    class HSMDateTimeUnixEpoch implements IHSMDateTimeUnixEpoch {
        /**
         * Constructs a new HSMDateTimeUnixEpoch.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHSMDateTimeUnixEpoch)

        /** HSMDateTimeUnixEpoch timestamp. */
        public timestamp: number | Long

        /**
         * Creates a new HSMDateTimeUnixEpoch instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HSMDateTimeUnixEpoch instance
         */
        public static create(properties?: proto.IHSMDateTimeUnixEpoch): proto.HSMDateTimeUnixEpoch

        /**
         * Encodes the specified HSMDateTimeUnixEpoch message. Does not implicitly {@link proto.HSMDateTimeUnixEpoch.verify|verify} messages.
         * @param message HSMDateTimeUnixEpoch message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHSMDateTimeUnixEpoch, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HSMDateTimeUnixEpoch message, length delimited. Does not implicitly {@link proto.HSMDateTimeUnixEpoch.verify|verify} messages.
         * @param message HSMDateTimeUnixEpoch message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IHSMDateTimeUnixEpoch, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a HSMDateTimeUnixEpoch message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HSMDateTimeUnixEpoch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HSMDateTimeUnixEpoch

        /**
         * Decodes a HSMDateTimeUnixEpoch message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HSMDateTimeUnixEpoch
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HSMDateTimeUnixEpoch

        /**
         * Verifies a HSMDateTimeUnixEpoch message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HSMDateTimeUnixEpoch message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HSMDateTimeUnixEpoch
         */
        public static fromObject(object: { [k: string]: any }): proto.HSMDateTimeUnixEpoch

        /**
         * Creates a plain object from a HSMDateTimeUnixEpoch message. Also converts values to other types if specified.
         * @param message HSMDateTimeUnixEpoch
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HSMDateTimeUnixEpoch,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HSMDateTimeUnixEpoch to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HSMDateTime. */
    interface IHSMDateTime {
        /** HSMDateTime component */
        component?: proto.IHSMDateTimeComponent | null

        /** HSMDateTime unixEpoch */
        unixEpoch?: proto.IHSMDateTimeUnixEpoch | null
    }

    /** Represents a HSMDateTime. */
    class HSMDateTime implements IHSMDateTime {
        /**
         * Constructs a new HSMDateTime.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHSMDateTime)

        /** HSMDateTime component. */
        public component?: proto.IHSMDateTimeComponent | null

        /** HSMDateTime unixEpoch. */
        public unixEpoch?: proto.IHSMDateTimeUnixEpoch | null

        /** HSMDateTime datetimeOneof. */
        public datetimeOneof?: 'component' | 'unixEpoch'

        /**
         * Creates a new HSMDateTime instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HSMDateTime instance
         */
        public static create(properties?: proto.IHSMDateTime): proto.HSMDateTime

        /**
         * Encodes the specified HSMDateTime message. Does not implicitly {@link proto.HSMDateTime.verify|verify} messages.
         * @param message HSMDateTime message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHSMDateTime, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HSMDateTime message, length delimited. Does not implicitly {@link proto.HSMDateTime.verify|verify} messages.
         * @param message HSMDateTime message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IHSMDateTime, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a HSMDateTime message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HSMDateTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HSMDateTime

        /**
         * Decodes a HSMDateTime message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HSMDateTime
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HSMDateTime

        /**
         * Verifies a HSMDateTime message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HSMDateTime message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HSMDateTime
         */
        public static fromObject(object: { [k: string]: any }): proto.HSMDateTime

        /**
         * Creates a plain object from a HSMDateTime message. Also converts values to other types if specified.
         * @param message HSMDateTime
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.HSMDateTime, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this HSMDateTime to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HSMLocalizableParameter. */
    interface IHSMLocalizableParameter {
        /** HSMLocalizableParameter default */
        default?: string | null

        /** HSMLocalizableParameter currency */
        currency?: proto.IHSMCurrency | null

        /** HSMLocalizableParameter dateTime */
        dateTime?: proto.IHSMDateTime | null
    }

    /** Represents a HSMLocalizableParameter. */
    class HSMLocalizableParameter implements IHSMLocalizableParameter {
        /**
         * Constructs a new HSMLocalizableParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHSMLocalizableParameter)

        /** HSMLocalizableParameter default. */
        public default: string

        /** HSMLocalizableParameter currency. */
        public currency?: proto.IHSMCurrency | null

        /** HSMLocalizableParameter dateTime. */
        public dateTime?: proto.IHSMDateTime | null

        /** HSMLocalizableParameter paramOneof. */
        public paramOneof?: 'currency' | 'dateTime'

        /**
         * Creates a new HSMLocalizableParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HSMLocalizableParameter instance
         */
        public static create(properties?: proto.IHSMLocalizableParameter): proto.HSMLocalizableParameter

        /**
         * Encodes the specified HSMLocalizableParameter message. Does not implicitly {@link proto.HSMLocalizableParameter.verify|verify} messages.
         * @param message HSMLocalizableParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHSMLocalizableParameter, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HSMLocalizableParameter message, length delimited. Does not implicitly {@link proto.HSMLocalizableParameter.verify|verify} messages.
         * @param message HSMLocalizableParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IHSMLocalizableParameter,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a HSMLocalizableParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HSMLocalizableParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HSMLocalizableParameter

        /**
         * Decodes a HSMLocalizableParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HSMLocalizableParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HSMLocalizableParameter

        /**
         * Verifies a HSMLocalizableParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HSMLocalizableParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HSMLocalizableParameter
         */
        public static fromObject(object: { [k: string]: any }): proto.HSMLocalizableParameter

        /**
         * Creates a plain object from a HSMLocalizableParameter message. Also converts values to other types if specified.
         * @param message HSMLocalizableParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HSMLocalizableParameter,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HSMLocalizableParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HighlyStructuredMessage. */
    interface IHighlyStructuredMessage {
        /** HighlyStructuredMessage namespace */
        namespace?: string | null

        /** HighlyStructuredMessage elementName */
        elementName?: string | null

        /** HighlyStructuredMessage params */
        params?: string[] | null

        /** HighlyStructuredMessage fallbackLg */
        fallbackLg?: string | null

        /** HighlyStructuredMessage fallbackLc */
        fallbackLc?: string | null

        /** HighlyStructuredMessage localizableParams */
        localizableParams?: proto.IHSMLocalizableParameter[] | null

        /** HighlyStructuredMessage deterministicLg */
        deterministicLg?: string | null

        /** HighlyStructuredMessage deterministicLc */
        deterministicLc?: string | null

        /** HighlyStructuredMessage hydratedHsm */
        hydratedHsm?: proto.ITemplateMessage | null
    }

    /** Represents a HighlyStructuredMessage. */
    class HighlyStructuredMessage implements IHighlyStructuredMessage {
        /**
         * Constructs a new HighlyStructuredMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHighlyStructuredMessage)

        /** HighlyStructuredMessage namespace. */
        public namespace: string

        /** HighlyStructuredMessage elementName. */
        public elementName: string

        /** HighlyStructuredMessage params. */
        public params: string[]

        /** HighlyStructuredMessage fallbackLg. */
        public fallbackLg: string

        /** HighlyStructuredMessage fallbackLc. */
        public fallbackLc: string

        /** HighlyStructuredMessage localizableParams. */
        public localizableParams: proto.IHSMLocalizableParameter[]

        /** HighlyStructuredMessage deterministicLg. */
        public deterministicLg: string

        /** HighlyStructuredMessage deterministicLc. */
        public deterministicLc: string

        /** HighlyStructuredMessage hydratedHsm. */
        public hydratedHsm?: proto.ITemplateMessage | null

        /**
         * Creates a new HighlyStructuredMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HighlyStructuredMessage instance
         */
        public static create(properties?: proto.IHighlyStructuredMessage): proto.HighlyStructuredMessage

        /**
         * Encodes the specified HighlyStructuredMessage message. Does not implicitly {@link proto.HighlyStructuredMessage.verify|verify} messages.
         * @param message HighlyStructuredMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHighlyStructuredMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HighlyStructuredMessage message, length delimited. Does not implicitly {@link proto.HighlyStructuredMessage.verify|verify} messages.
         * @param message HighlyStructuredMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IHighlyStructuredMessage,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a HighlyStructuredMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HighlyStructuredMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HighlyStructuredMessage

        /**
         * Decodes a HighlyStructuredMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HighlyStructuredMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HighlyStructuredMessage

        /**
         * Verifies a HighlyStructuredMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HighlyStructuredMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HighlyStructuredMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.HighlyStructuredMessage

        /**
         * Creates a plain object from a HighlyStructuredMessage message. Also converts values to other types if specified.
         * @param message HighlyStructuredMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HighlyStructuredMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HighlyStructuredMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a SendPaymentMessage. */
    interface ISendPaymentMessage {
        /** SendPaymentMessage noteMessage */
        noteMessage?: proto.IMessage | null

        /** SendPaymentMessage requestMessageKey */
        requestMessageKey?: proto.IMessageKey | null
    }

    /** Represents a SendPaymentMessage. */
    class SendPaymentMessage implements ISendPaymentMessage {
        /**
         * Constructs a new SendPaymentMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ISendPaymentMessage)

        /** SendPaymentMessage noteMessage. */
        public noteMessage?: proto.IMessage | null

        /** SendPaymentMessage requestMessageKey. */
        public requestMessageKey?: proto.IMessageKey | null

        /**
         * Creates a new SendPaymentMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SendPaymentMessage instance
         */
        public static create(properties?: proto.ISendPaymentMessage): proto.SendPaymentMessage

        /**
         * Encodes the specified SendPaymentMessage message. Does not implicitly {@link proto.SendPaymentMessage.verify|verify} messages.
         * @param message SendPaymentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ISendPaymentMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified SendPaymentMessage message, length delimited. Does not implicitly {@link proto.SendPaymentMessage.verify|verify} messages.
         * @param message SendPaymentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ISendPaymentMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a SendPaymentMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SendPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.SendPaymentMessage

        /**
         * Decodes a SendPaymentMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SendPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.SendPaymentMessage

        /**
         * Verifies a SendPaymentMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a SendPaymentMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SendPaymentMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.SendPaymentMessage

        /**
         * Creates a plain object from a SendPaymentMessage message. Also converts values to other types if specified.
         * @param message SendPaymentMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.SendPaymentMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this SendPaymentMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a RequestPaymentMessage. */
    interface IRequestPaymentMessage {
        /** RequestPaymentMessage noteMessage */
        noteMessage?: proto.IMessage | null

        /** RequestPaymentMessage currencyCodeIso4217 */
        currencyCodeIso4217?: string | null

        /** RequestPaymentMessage amount1000 */
        amount1000?: number | Long | null

        /** RequestPaymentMessage requestFrom */
        requestFrom?: string | null

        /** RequestPaymentMessage expiryTimestamp */
        expiryTimestamp?: number | Long | null
    }

    /** Represents a RequestPaymentMessage. */
    class RequestPaymentMessage implements IRequestPaymentMessage {
        /**
         * Constructs a new RequestPaymentMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IRequestPaymentMessage)

        /** RequestPaymentMessage noteMessage. */
        public noteMessage?: proto.IMessage | null

        /** RequestPaymentMessage currencyCodeIso4217. */
        public currencyCodeIso4217: string

        /** RequestPaymentMessage amount1000. */
        public amount1000: number | Long

        /** RequestPaymentMessage requestFrom. */
        public requestFrom: string

        /** RequestPaymentMessage expiryTimestamp. */
        public expiryTimestamp: number | Long

        /**
         * Creates a new RequestPaymentMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RequestPaymentMessage instance
         */
        public static create(properties?: proto.IRequestPaymentMessage): proto.RequestPaymentMessage

        /**
         * Encodes the specified RequestPaymentMessage message. Does not implicitly {@link proto.RequestPaymentMessage.verify|verify} messages.
         * @param message RequestPaymentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IRequestPaymentMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified RequestPaymentMessage message, length delimited. Does not implicitly {@link proto.RequestPaymentMessage.verify|verify} messages.
         * @param message RequestPaymentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IRequestPaymentMessage,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a RequestPaymentMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RequestPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.RequestPaymentMessage

        /**
         * Decodes a RequestPaymentMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RequestPaymentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.RequestPaymentMessage

        /**
         * Verifies a RequestPaymentMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a RequestPaymentMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RequestPaymentMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.RequestPaymentMessage

        /**
         * Creates a plain object from a RequestPaymentMessage message. Also converts values to other types if specified.
         * @param message RequestPaymentMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.RequestPaymentMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this RequestPaymentMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a DeclinePaymentRequestMessage. */
    interface IDeclinePaymentRequestMessage {
        /** DeclinePaymentRequestMessage key */
        key?: proto.IMessageKey | null
    }

    /** Represents a DeclinePaymentRequestMessage. */
    class DeclinePaymentRequestMessage implements IDeclinePaymentRequestMessage {
        /**
         * Constructs a new DeclinePaymentRequestMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IDeclinePaymentRequestMessage)

        /** DeclinePaymentRequestMessage key. */
        public key?: proto.IMessageKey | null

        /**
         * Creates a new DeclinePaymentRequestMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeclinePaymentRequestMessage instance
         */
        public static create(properties?: proto.IDeclinePaymentRequestMessage): proto.DeclinePaymentRequestMessage

        /**
         * Encodes the specified DeclinePaymentRequestMessage message. Does not implicitly {@link proto.DeclinePaymentRequestMessage.verify|verify} messages.
         * @param message DeclinePaymentRequestMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IDeclinePaymentRequestMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified DeclinePaymentRequestMessage message, length delimited. Does not implicitly {@link proto.DeclinePaymentRequestMessage.verify|verify} messages.
         * @param message DeclinePaymentRequestMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IDeclinePaymentRequestMessage,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a DeclinePaymentRequestMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeclinePaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.DeclinePaymentRequestMessage

        /**
         * Decodes a DeclinePaymentRequestMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeclinePaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.DeclinePaymentRequestMessage

        /**
         * Verifies a DeclinePaymentRequestMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a DeclinePaymentRequestMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeclinePaymentRequestMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.DeclinePaymentRequestMessage

        /**
         * Creates a plain object from a DeclinePaymentRequestMessage message. Also converts values to other types if specified.
         * @param message DeclinePaymentRequestMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.DeclinePaymentRequestMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this DeclinePaymentRequestMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a CancelPaymentRequestMessage. */
    interface ICancelPaymentRequestMessage {
        /** CancelPaymentRequestMessage key */
        key?: proto.IMessageKey | null
    }

    /** Represents a CancelPaymentRequestMessage. */
    class CancelPaymentRequestMessage implements ICancelPaymentRequestMessage {
        /**
         * Constructs a new CancelPaymentRequestMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ICancelPaymentRequestMessage)

        /** CancelPaymentRequestMessage key. */
        public key?: proto.IMessageKey | null

        /**
         * Creates a new CancelPaymentRequestMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CancelPaymentRequestMessage instance
         */
        public static create(properties?: proto.ICancelPaymentRequestMessage): proto.CancelPaymentRequestMessage

        /**
         * Encodes the specified CancelPaymentRequestMessage message. Does not implicitly {@link proto.CancelPaymentRequestMessage.verify|verify} messages.
         * @param message CancelPaymentRequestMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ICancelPaymentRequestMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified CancelPaymentRequestMessage message, length delimited. Does not implicitly {@link proto.CancelPaymentRequestMessage.verify|verify} messages.
         * @param message CancelPaymentRequestMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.ICancelPaymentRequestMessage,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a CancelPaymentRequestMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CancelPaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.CancelPaymentRequestMessage

        /**
         * Decodes a CancelPaymentRequestMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CancelPaymentRequestMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.CancelPaymentRequestMessage

        /**
         * Verifies a CancelPaymentRequestMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a CancelPaymentRequestMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CancelPaymentRequestMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.CancelPaymentRequestMessage

        /**
         * Creates a plain object from a CancelPaymentRequestMessage message. Also converts values to other types if specified.
         * @param message CancelPaymentRequestMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.CancelPaymentRequestMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this CancelPaymentRequestMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a LiveLocationMessage. */
    interface ILiveLocationMessage {
        /** LiveLocationMessage degreesLatitude */
        degreesLatitude?: number | null

        /** LiveLocationMessage degreesLongitude */
        degreesLongitude?: number | null

        /** LiveLocationMessage accuracyInMeters */
        accuracyInMeters?: number | null

        /** LiveLocationMessage speedInMps */
        speedInMps?: number | null

        /** LiveLocationMessage degreesClockwiseFromMagneticNorth */
        degreesClockwiseFromMagneticNorth?: number | null

        /** LiveLocationMessage caption */
        caption?: string | null

        /** LiveLocationMessage sequenceNumber */
        sequenceNumber?: number | Long | null

        /** LiveLocationMessage timeOffset */
        timeOffset?: number | null

        /** LiveLocationMessage jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** LiveLocationMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a LiveLocationMessage. */
    class LiveLocationMessage implements ILiveLocationMessage {
        /**
         * Constructs a new LiveLocationMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ILiveLocationMessage)

        /** LiveLocationMessage degreesLatitude. */
        public degreesLatitude: number

        /** LiveLocationMessage degreesLongitude. */
        public degreesLongitude: number

        /** LiveLocationMessage accuracyInMeters. */
        public accuracyInMeters: number

        /** LiveLocationMessage speedInMps. */
        public speedInMps: number

        /** LiveLocationMessage degreesClockwiseFromMagneticNorth. */
        public degreesClockwiseFromMagneticNorth: number

        /** LiveLocationMessage caption. */
        public caption: string

        /** LiveLocationMessage sequenceNumber. */
        public sequenceNumber: number | Long

        /** LiveLocationMessage timeOffset. */
        public timeOffset: number

        /** LiveLocationMessage jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** LiveLocationMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new LiveLocationMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LiveLocationMessage instance
         */
        public static create(properties?: proto.ILiveLocationMessage): proto.LiveLocationMessage

        /**
         * Encodes the specified LiveLocationMessage message. Does not implicitly {@link proto.LiveLocationMessage.verify|verify} messages.
         * @param message LiveLocationMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ILiveLocationMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified LiveLocationMessage message, length delimited. Does not implicitly {@link proto.LiveLocationMessage.verify|verify} messages.
         * @param message LiveLocationMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ILiveLocationMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a LiveLocationMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LiveLocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.LiveLocationMessage

        /**
         * Decodes a LiveLocationMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LiveLocationMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.LiveLocationMessage

        /**
         * Verifies a LiveLocationMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a LiveLocationMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LiveLocationMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.LiveLocationMessage

        /**
         * Creates a plain object from a LiveLocationMessage message. Also converts values to other types if specified.
         * @param message LiveLocationMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.LiveLocationMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this LiveLocationMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a StickerMessage. */
    interface IStickerMessage {
        /** StickerMessage url */
        url?: string | null

        /** StickerMessage fileSha256 */
        fileSha256?: Uint8Array | null

        /** StickerMessage fileEncSha256 */
        fileEncSha256?: Uint8Array | null

        /** StickerMessage mediaKey */
        mediaKey?: Uint8Array | null

        /** StickerMessage mimetype */
        mimetype?: string | null

        /** StickerMessage height */
        height?: number | null

        /** StickerMessage width */
        width?: number | null

        /** StickerMessage directPath */
        directPath?: string | null

        /** StickerMessage fileLength */
        fileLength?: number | Long | null

        /** StickerMessage mediaKeyTimestamp */
        mediaKeyTimestamp?: number | Long | null

        /** StickerMessage firstFrameLength */
        firstFrameLength?: number | null

        /** StickerMessage firstFrameSidecar */
        firstFrameSidecar?: Uint8Array | null

        /** StickerMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a StickerMessage. */
    class StickerMessage implements IStickerMessage {
        /**
         * Constructs a new StickerMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IStickerMessage)

        /** StickerMessage url. */
        public url: string

        /** StickerMessage fileSha256. */
        public fileSha256: Uint8Array

        /** StickerMessage fileEncSha256. */
        public fileEncSha256: Uint8Array

        /** StickerMessage mediaKey. */
        public mediaKey: Uint8Array

        /** StickerMessage mimetype. */
        public mimetype: string

        /** StickerMessage height. */
        public height: number

        /** StickerMessage width. */
        public width: number

        /** StickerMessage directPath. */
        public directPath: string

        /** StickerMessage fileLength. */
        public fileLength: number | Long

        /** StickerMessage mediaKeyTimestamp. */
        public mediaKeyTimestamp: number | Long

        /** StickerMessage firstFrameLength. */
        public firstFrameLength: number

        /** StickerMessage firstFrameSidecar. */
        public firstFrameSidecar: Uint8Array

        /** StickerMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new StickerMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StickerMessage instance
         */
        public static create(properties?: proto.IStickerMessage): proto.StickerMessage

        /**
         * Encodes the specified StickerMessage message. Does not implicitly {@link proto.StickerMessage.verify|verify} messages.
         * @param message StickerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IStickerMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified StickerMessage message, length delimited. Does not implicitly {@link proto.StickerMessage.verify|verify} messages.
         * @param message StickerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IStickerMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a StickerMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.StickerMessage

        /**
         * Decodes a StickerMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StickerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.StickerMessage

        /**
         * Verifies a StickerMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a StickerMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StickerMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.StickerMessage

        /**
         * Creates a plain object from a StickerMessage message. Also converts values to other types if specified.
         * @param message StickerMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.StickerMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this StickerMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a FourRowTemplate. */
    interface IFourRowTemplate {
        /** FourRowTemplate content */
        content?: proto.IHighlyStructuredMessage | null

        /** FourRowTemplate footer */
        footer?: proto.IHighlyStructuredMessage | null

        /** FourRowTemplate buttons */
        buttons?: proto.ITemplateButton[] | null

        /** FourRowTemplate documentMessage */
        documentMessage?: proto.IDocumentMessage | null

        /** FourRowTemplate highlyStructuredMessage */
        highlyStructuredMessage?: proto.IHighlyStructuredMessage | null

        /** FourRowTemplate imageMessage */
        imageMessage?: proto.IImageMessage | null

        /** FourRowTemplate videoMessage */
        videoMessage?: proto.IVideoMessage | null

        /** FourRowTemplate locationMessage */
        locationMessage?: proto.ILocationMessage | null
    }

    /** Represents a FourRowTemplate. */
    class FourRowTemplate implements IFourRowTemplate {
        /**
         * Constructs a new FourRowTemplate.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IFourRowTemplate)

        /** FourRowTemplate content. */
        public content?: proto.IHighlyStructuredMessage | null

        /** FourRowTemplate footer. */
        public footer?: proto.IHighlyStructuredMessage | null

        /** FourRowTemplate buttons. */
        public buttons: proto.ITemplateButton[]

        /** FourRowTemplate documentMessage. */
        public documentMessage?: proto.IDocumentMessage | null

        /** FourRowTemplate highlyStructuredMessage. */
        public highlyStructuredMessage?: proto.IHighlyStructuredMessage | null

        /** FourRowTemplate imageMessage. */
        public imageMessage?: proto.IImageMessage | null

        /** FourRowTemplate videoMessage. */
        public videoMessage?: proto.IVideoMessage | null

        /** FourRowTemplate locationMessage. */
        public locationMessage?: proto.ILocationMessage | null

        /** FourRowTemplate title. */
        public title?:
            | 'documentMessage'
            | 'highlyStructuredMessage'
            | 'imageMessage'
            | 'videoMessage'
            | 'locationMessage'

        /**
         * Creates a new FourRowTemplate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FourRowTemplate instance
         */
        public static create(properties?: proto.IFourRowTemplate): proto.FourRowTemplate

        /**
         * Encodes the specified FourRowTemplate message. Does not implicitly {@link proto.FourRowTemplate.verify|verify} messages.
         * @param message FourRowTemplate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IFourRowTemplate, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified FourRowTemplate message, length delimited. Does not implicitly {@link proto.FourRowTemplate.verify|verify} messages.
         * @param message FourRowTemplate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IFourRowTemplate, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a FourRowTemplate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.FourRowTemplate

        /**
         * Decodes a FourRowTemplate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.FourRowTemplate

        /**
         * Verifies a FourRowTemplate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a FourRowTemplate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FourRowTemplate
         */
        public static fromObject(object: { [k: string]: any }): proto.FourRowTemplate

        /**
         * Creates a plain object from a FourRowTemplate message. Also converts values to other types if specified.
         * @param message FourRowTemplate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.FourRowTemplate,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this FourRowTemplate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a HydratedFourRowTemplate. */
    interface IHydratedFourRowTemplate {
        /** HydratedFourRowTemplate hydratedContentText */
        hydratedContentText?: string | null

        /** HydratedFourRowTemplate hydratedFooterText */
        hydratedFooterText?: string | null

        /** HydratedFourRowTemplate hydratedButtons */
        hydratedButtons?: proto.IHydratedTemplateButton[] | null

        /** HydratedFourRowTemplate templateId */
        templateId?: string | null

        /** HydratedFourRowTemplate documentMessage */
        documentMessage?: proto.IDocumentMessage | null

        /** HydratedFourRowTemplate hydratedTitleText */
        hydratedTitleText?: string | null

        /** HydratedFourRowTemplate imageMessage */
        imageMessage?: proto.IImageMessage | null

        /** HydratedFourRowTemplate videoMessage */
        videoMessage?: proto.IVideoMessage | null

        /** HydratedFourRowTemplate locationMessage */
        locationMessage?: proto.ILocationMessage | null
    }

    /** Represents a HydratedFourRowTemplate. */
    class HydratedFourRowTemplate implements IHydratedFourRowTemplate {
        /**
         * Constructs a new HydratedFourRowTemplate.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IHydratedFourRowTemplate)

        /** HydratedFourRowTemplate hydratedContentText. */
        public hydratedContentText: string

        /** HydratedFourRowTemplate hydratedFooterText. */
        public hydratedFooterText: string

        /** HydratedFourRowTemplate hydratedButtons. */
        public hydratedButtons: proto.IHydratedTemplateButton[]

        /** HydratedFourRowTemplate templateId. */
        public templateId: string

        /** HydratedFourRowTemplate documentMessage. */
        public documentMessage?: proto.IDocumentMessage | null

        /** HydratedFourRowTemplate hydratedTitleText. */
        public hydratedTitleText: string

        /** HydratedFourRowTemplate imageMessage. */
        public imageMessage?: proto.IImageMessage | null

        /** HydratedFourRowTemplate videoMessage. */
        public videoMessage?: proto.IVideoMessage | null

        /** HydratedFourRowTemplate locationMessage. */
        public locationMessage?: proto.ILocationMessage | null

        /** HydratedFourRowTemplate title. */
        public title?: 'documentMessage' | 'hydratedTitleText' | 'imageMessage' | 'videoMessage' | 'locationMessage'

        /**
         * Creates a new HydratedFourRowTemplate instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HydratedFourRowTemplate instance
         */
        public static create(properties?: proto.IHydratedFourRowTemplate): proto.HydratedFourRowTemplate

        /**
         * Encodes the specified HydratedFourRowTemplate message. Does not implicitly {@link proto.HydratedFourRowTemplate.verify|verify} messages.
         * @param message HydratedFourRowTemplate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IHydratedFourRowTemplate, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified HydratedFourRowTemplate message, length delimited. Does not implicitly {@link proto.HydratedFourRowTemplate.verify|verify} messages.
         * @param message HydratedFourRowTemplate message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.IHydratedFourRowTemplate,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a HydratedFourRowTemplate message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HydratedFourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.HydratedFourRowTemplate

        /**
         * Decodes a HydratedFourRowTemplate message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HydratedFourRowTemplate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.HydratedFourRowTemplate

        /**
         * Verifies a HydratedFourRowTemplate message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a HydratedFourRowTemplate message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HydratedFourRowTemplate
         */
        public static fromObject(object: { [k: string]: any }): proto.HydratedFourRowTemplate

        /**
         * Creates a plain object from a HydratedFourRowTemplate message. Also converts values to other types if specified.
         * @param message HydratedFourRowTemplate
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.HydratedFourRowTemplate,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this HydratedFourRowTemplate to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a TemplateMessage. */
    interface ITemplateMessage {
        /** TemplateMessage contextInfo */
        contextInfo?: proto.IContextInfo | null

        /** TemplateMessage hydratedTemplate */
        hydratedTemplate?: proto.IHydratedFourRowTemplate | null

        /** TemplateMessage fourRowTemplate */
        fourRowTemplate?: proto.IFourRowTemplate | null

        /** TemplateMessage hydratedFourRowTemplate */
        hydratedFourRowTemplate?: proto.IHydratedFourRowTemplate | null
    }

    /** Represents a TemplateMessage. */
    class TemplateMessage implements ITemplateMessage {
        /**
         * Constructs a new TemplateMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ITemplateMessage)

        /** TemplateMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /** TemplateMessage hydratedTemplate. */
        public hydratedTemplate?: proto.IHydratedFourRowTemplate | null

        /** TemplateMessage fourRowTemplate. */
        public fourRowTemplate?: proto.IFourRowTemplate | null

        /** TemplateMessage hydratedFourRowTemplate. */
        public hydratedFourRowTemplate?: proto.IHydratedFourRowTemplate | null

        /** TemplateMessage format. */
        public format?: 'fourRowTemplate' | 'hydratedFourRowTemplate'

        /**
         * Creates a new TemplateMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TemplateMessage instance
         */
        public static create(properties?: proto.ITemplateMessage): proto.TemplateMessage

        /**
         * Encodes the specified TemplateMessage message. Does not implicitly {@link proto.TemplateMessage.verify|verify} messages.
         * @param message TemplateMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ITemplateMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified TemplateMessage message, length delimited. Does not implicitly {@link proto.TemplateMessage.verify|verify} messages.
         * @param message TemplateMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.ITemplateMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a TemplateMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TemplateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.TemplateMessage

        /**
         * Decodes a TemplateMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TemplateMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.TemplateMessage

        /**
         * Verifies a TemplateMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a TemplateMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TemplateMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.TemplateMessage

        /**
         * Creates a plain object from a TemplateMessage message. Also converts values to other types if specified.
         * @param message TemplateMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.TemplateMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this TemplateMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a TemplateButtonReplyMessage. */
    interface ITemplateButtonReplyMessage {
        /** TemplateButtonReplyMessage selectedId */
        selectedId?: string | null

        /** TemplateButtonReplyMessage selectedDisplayText */
        selectedDisplayText?: string | null

        /** TemplateButtonReplyMessage contextInfo */
        contextInfo?: proto.IContextInfo | null

        /** TemplateButtonReplyMessage selectedIndex */
        selectedIndex?: number | null
    }

    /** Represents a TemplateButtonReplyMessage. */
    class TemplateButtonReplyMessage implements ITemplateButtonReplyMessage {
        /**
         * Constructs a new TemplateButtonReplyMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ITemplateButtonReplyMessage)

        /** TemplateButtonReplyMessage selectedId. */
        public selectedId: string

        /** TemplateButtonReplyMessage selectedDisplayText. */
        public selectedDisplayText: string

        /** TemplateButtonReplyMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /** TemplateButtonReplyMessage selectedIndex. */
        public selectedIndex: number

        /**
         * Creates a new TemplateButtonReplyMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TemplateButtonReplyMessage instance
         */
        public static create(properties?: proto.ITemplateButtonReplyMessage): proto.TemplateButtonReplyMessage

        /**
         * Encodes the specified TemplateButtonReplyMessage message. Does not implicitly {@link proto.TemplateButtonReplyMessage.verify|verify} messages.
         * @param message TemplateButtonReplyMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ITemplateButtonReplyMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified TemplateButtonReplyMessage message, length delimited. Does not implicitly {@link proto.TemplateButtonReplyMessage.verify|verify} messages.
         * @param message TemplateButtonReplyMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.ITemplateButtonReplyMessage,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a TemplateButtonReplyMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TemplateButtonReplyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.TemplateButtonReplyMessage

        /**
         * Decodes a TemplateButtonReplyMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TemplateButtonReplyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.TemplateButtonReplyMessage

        /**
         * Verifies a TemplateButtonReplyMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a TemplateButtonReplyMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TemplateButtonReplyMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.TemplateButtonReplyMessage

        /**
         * Creates a plain object from a TemplateButtonReplyMessage message. Also converts values to other types if specified.
         * @param message TemplateButtonReplyMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.TemplateButtonReplyMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this TemplateButtonReplyMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a ProductSnapshot. */
    interface IProductSnapshot {
        /** ProductSnapshot productImage */
        productImage?: proto.IImageMessage | null

        /** ProductSnapshot productId */
        productId?: string | null

        /** ProductSnapshot title */
        title?: string | null

        /** ProductSnapshot description */
        description?: string | null

        /** ProductSnapshot currencyCode */
        currencyCode?: string | null

        /** ProductSnapshot priceAmount1000 */
        priceAmount1000?: number | Long | null

        /** ProductSnapshot retailerId */
        retailerId?: string | null

        /** ProductSnapshot url */
        url?: string | null

        /** ProductSnapshot productImageCount */
        productImageCount?: number | null

        /** ProductSnapshot firstImageId */
        firstImageId?: string | null
    }

    /** Represents a ProductSnapshot. */
    class ProductSnapshot implements IProductSnapshot {
        /**
         * Constructs a new ProductSnapshot.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IProductSnapshot)

        /** ProductSnapshot productImage. */
        public productImage?: proto.IImageMessage | null

        /** ProductSnapshot productId. */
        public productId: string

        /** ProductSnapshot title. */
        public title: string

        /** ProductSnapshot description. */
        public description: string

        /** ProductSnapshot currencyCode. */
        public currencyCode: string

        /** ProductSnapshot priceAmount1000. */
        public priceAmount1000: number | Long

        /** ProductSnapshot retailerId. */
        public retailerId: string

        /** ProductSnapshot url. */
        public url: string

        /** ProductSnapshot productImageCount. */
        public productImageCount: number

        /** ProductSnapshot firstImageId. */
        public firstImageId: string

        /**
         * Creates a new ProductSnapshot instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProductSnapshot instance
         */
        public static create(properties?: proto.IProductSnapshot): proto.ProductSnapshot

        /**
         * Encodes the specified ProductSnapshot message. Does not implicitly {@link proto.ProductSnapshot.verify|verify} messages.
         * @param message ProductSnapshot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IProductSnapshot, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ProductSnapshot message, length delimited. Does not implicitly {@link proto.ProductSnapshot.verify|verify} messages.
         * @param message ProductSnapshot message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IProductSnapshot, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a ProductSnapshot message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProductSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ProductSnapshot

        /**
         * Decodes a ProductSnapshot message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProductSnapshot
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ProductSnapshot

        /**
         * Verifies a ProductSnapshot message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a ProductSnapshot message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProductSnapshot
         */
        public static fromObject(object: { [k: string]: any }): proto.ProductSnapshot

        /**
         * Creates a plain object from a ProductSnapshot message. Also converts values to other types if specified.
         * @param message ProductSnapshot
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.ProductSnapshot,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this ProductSnapshot to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a ProductMessage. */
    interface IProductMessage {
        /** ProductMessage product */
        product?: proto.IProductSnapshot | null

        /** ProductMessage businessOwnerJid */
        businessOwnerJid?: string | null

        /** ProductMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a ProductMessage. */
    class ProductMessage implements IProductMessage {
        /**
         * Constructs a new ProductMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IProductMessage)

        /** ProductMessage product. */
        public product?: proto.IProductSnapshot | null

        /** ProductMessage businessOwnerJid. */
        public businessOwnerJid: string

        /** ProductMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new ProductMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProductMessage instance
         */
        public static create(properties?: proto.IProductMessage): proto.ProductMessage

        /**
         * Encodes the specified ProductMessage message. Does not implicitly {@link proto.ProductMessage.verify|verify} messages.
         * @param message ProductMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IProductMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified ProductMessage message, length delimited. Does not implicitly {@link proto.ProductMessage.verify|verify} messages.
         * @param message ProductMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IProductMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a ProductMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProductMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.ProductMessage

        /**
         * Decodes a ProductMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProductMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.ProductMessage

        /**
         * Verifies a ProductMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a ProductMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProductMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.ProductMessage

        /**
         * Creates a plain object from a ProductMessage message. Also converts values to other types if specified.
         * @param message ProductMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.ProductMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this ProductMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a GroupInviteMessage. */
    interface IGroupInviteMessage {
        /** GroupInviteMessage groupJid */
        groupJid?: string | null

        /** GroupInviteMessage inviteCode */
        inviteCode?: string | null

        /** GroupInviteMessage inviteExpiration */
        inviteExpiration?: number | Long | null

        /** GroupInviteMessage groupName */
        groupName?: string | null

        /** GroupInviteMessage jpegThumbnail */
        jpegThumbnail?: Uint8Array | null

        /** GroupInviteMessage caption */
        caption?: string | null

        /** GroupInviteMessage contextInfo */
        contextInfo?: proto.IContextInfo | null
    }

    /** Represents a GroupInviteMessage. */
    class GroupInviteMessage implements IGroupInviteMessage {
        /**
         * Constructs a new GroupInviteMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IGroupInviteMessage)

        /** GroupInviteMessage groupJid. */
        public groupJid: string

        /** GroupInviteMessage inviteCode. */
        public inviteCode: string

        /** GroupInviteMessage inviteExpiration. */
        public inviteExpiration: number | Long

        /** GroupInviteMessage groupName. */
        public groupName: string

        /** GroupInviteMessage jpegThumbnail. */
        public jpegThumbnail: Uint8Array

        /** GroupInviteMessage caption. */
        public caption: string

        /** GroupInviteMessage contextInfo. */
        public contextInfo?: proto.IContextInfo | null

        /**
         * Creates a new GroupInviteMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GroupInviteMessage instance
         */
        public static create(properties?: proto.IGroupInviteMessage): proto.GroupInviteMessage

        /**
         * Encodes the specified GroupInviteMessage message. Does not implicitly {@link proto.GroupInviteMessage.verify|verify} messages.
         * @param message GroupInviteMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IGroupInviteMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified GroupInviteMessage message, length delimited. Does not implicitly {@link proto.GroupInviteMessage.verify|verify} messages.
         * @param message GroupInviteMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IGroupInviteMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a GroupInviteMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GroupInviteMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.GroupInviteMessage

        /**
         * Decodes a GroupInviteMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GroupInviteMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.GroupInviteMessage

        /**
         * Verifies a GroupInviteMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a GroupInviteMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GroupInviteMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.GroupInviteMessage

        /**
         * Creates a plain object from a GroupInviteMessage message. Also converts values to other types if specified.
         * @param message GroupInviteMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.GroupInviteMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this GroupInviteMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a DeviceSentMessage. */
    interface IDeviceSentMessage {
        /** DeviceSentMessage destinationJid */
        destinationJid?: string | null

        /** DeviceSentMessage message */
        message?: proto.IMessage | null
    }

    /** Represents a DeviceSentMessage. */
    class DeviceSentMessage implements IDeviceSentMessage {
        /**
         * Constructs a new DeviceSentMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IDeviceSentMessage)

        /** DeviceSentMessage destinationJid. */
        public destinationJid: string

        /** DeviceSentMessage message. */
        public message?: proto.IMessage | null

        /**
         * Creates a new DeviceSentMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeviceSentMessage instance
         */
        public static create(properties?: proto.IDeviceSentMessage): proto.DeviceSentMessage

        /**
         * Encodes the specified DeviceSentMessage message. Does not implicitly {@link proto.DeviceSentMessage.verify|verify} messages.
         * @param message DeviceSentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IDeviceSentMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified DeviceSentMessage message, length delimited. Does not implicitly {@link proto.DeviceSentMessage.verify|verify} messages.
         * @param message DeviceSentMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IDeviceSentMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a DeviceSentMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeviceSentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.DeviceSentMessage

        /**
         * Decodes a DeviceSentMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeviceSentMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.DeviceSentMessage

        /**
         * Verifies a DeviceSentMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a DeviceSentMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeviceSentMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.DeviceSentMessage

        /**
         * Creates a plain object from a DeviceSentMessage message. Also converts values to other types if specified.
         * @param message DeviceSentMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.DeviceSentMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this DeviceSentMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a DeviceSyncMessage. */
    interface IDeviceSyncMessage {
        /** DeviceSyncMessage serializedXmlBytes */
        serializedXmlBytes?: Uint8Array | null
    }

    /** Represents a DeviceSyncMessage. */
    class DeviceSyncMessage implements IDeviceSyncMessage {
        /**
         * Constructs a new DeviceSyncMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IDeviceSyncMessage)

        /** DeviceSyncMessage serializedXmlBytes. */
        public serializedXmlBytes: Uint8Array

        /**
         * Creates a new DeviceSyncMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeviceSyncMessage instance
         */
        public static create(properties?: proto.IDeviceSyncMessage): proto.DeviceSyncMessage

        /**
         * Encodes the specified DeviceSyncMessage message. Does not implicitly {@link proto.DeviceSyncMessage.verify|verify} messages.
         * @param message DeviceSyncMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IDeviceSyncMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified DeviceSyncMessage message, length delimited. Does not implicitly {@link proto.DeviceSyncMessage.verify|verify} messages.
         * @param message DeviceSyncMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IDeviceSyncMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a DeviceSyncMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeviceSyncMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.DeviceSyncMessage

        /**
         * Decodes a DeviceSyncMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeviceSyncMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.DeviceSyncMessage

        /**
         * Verifies a DeviceSyncMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a DeviceSyncMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeviceSyncMessage
         */
        public static fromObject(object: { [k: string]: any }): proto.DeviceSyncMessage

        /**
         * Creates a plain object from a DeviceSyncMessage message. Also converts values to other types if specified.
         * @param message DeviceSyncMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.DeviceSyncMessage,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this DeviceSyncMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a Message. */
    interface IMessage {
        /** Message conversation */
        conversation?: string | null

        /** Message senderKeyDistributionMessage */
        senderKeyDistributionMessage?: proto.ISenderKeyDistributionMessage | null

        /** Message imageMessage */
        imageMessage?: proto.IImageMessage | null

        /** Message contactMessage */
        contactMessage?: proto.IContactMessage | null

        /** Message locationMessage */
        locationMessage?: proto.ILocationMessage | null

        /** Message extendedTextMessage */
        extendedTextMessage?: proto.IExtendedTextMessage | null

        /** Message documentMessage */
        documentMessage?: proto.IDocumentMessage | null

        /** Message audioMessage */
        audioMessage?: proto.IAudioMessage | null

        /** Message videoMessage */
        videoMessage?: proto.IVideoMessage | null

        /** Message call */
        call?: proto.ICall | null

        /** Message chat */
        chat?: proto.IChat | null

        /** Message protocolMessage */
        protocolMessage?: proto.IProtocolMessage | null

        /** Message contactsArrayMessage */
        contactsArrayMessage?: proto.IContactsArrayMessage | null

        /** Message highlyStructuredMessage */
        highlyStructuredMessage?: proto.IHighlyStructuredMessage | null

        /** Message fastRatchetKeySenderKeyDistributionMessage */
        fastRatchetKeySenderKeyDistributionMessage?: proto.ISenderKeyDistributionMessage | null

        /** Message sendPaymentMessage */
        sendPaymentMessage?: proto.ISendPaymentMessage | null

        /** Message liveLocationMessage */
        liveLocationMessage?: proto.ILiveLocationMessage | null

        /** Message requestPaymentMessage */
        requestPaymentMessage?: proto.IRequestPaymentMessage | null

        /** Message declinePaymentRequestMessage */
        declinePaymentRequestMessage?: proto.IDeclinePaymentRequestMessage | null

        /** Message cancelPaymentRequestMessage */
        cancelPaymentRequestMessage?: proto.ICancelPaymentRequestMessage | null

        /** Message templateMessage */
        templateMessage?: proto.ITemplateMessage | null

        /** Message stickerMessage */
        stickerMessage?: proto.IStickerMessage | null

        /** Message groupInviteMessage */
        groupInviteMessage?: proto.IGroupInviteMessage | null

        /** Message templateButtonReplyMessage */
        templateButtonReplyMessage?: proto.ITemplateButtonReplyMessage | null

        /** Message productMessage */
        productMessage?: proto.IProductMessage | null

        /** Message deviceSentMessage */
        deviceSentMessage?: proto.IDeviceSentMessage | null

        /** Message deviceSyncMessage */
        deviceSyncMessage?: proto.IDeviceSyncMessage | null
    }

    /** Represents a Message. */
    class Message implements IMessage {
        /**
         * Constructs a new Message.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IMessage)

        /** Message conversation. */
        public conversation: string

        /** Message senderKeyDistributionMessage. */
        public senderKeyDistributionMessage?: proto.ISenderKeyDistributionMessage | null

        /** Message imageMessage. */
        public imageMessage?: proto.IImageMessage | null

        /** Message contactMessage. */
        public contactMessage?: proto.IContactMessage | null

        /** Message locationMessage. */
        public locationMessage?: proto.ILocationMessage | null

        /** Message extendedTextMessage. */
        public extendedTextMessage?: proto.IExtendedTextMessage | null

        /** Message documentMessage. */
        public documentMessage?: proto.IDocumentMessage | null

        /** Message audioMessage. */
        public audioMessage?: proto.IAudioMessage | null

        /** Message videoMessage. */
        public videoMessage?: proto.IVideoMessage | null

        /** Message call. */
        public call?: proto.ICall | null

        /** Message chat. */
        public chat?: proto.IChat | null

        /** Message protocolMessage. */
        public protocolMessage?: proto.IProtocolMessage | null

        /** Message contactsArrayMessage. */
        public contactsArrayMessage?: proto.IContactsArrayMessage | null

        /** Message highlyStructuredMessage. */
        public highlyStructuredMessage?: proto.IHighlyStructuredMessage | null

        /** Message fastRatchetKeySenderKeyDistributionMessage. */
        public fastRatchetKeySenderKeyDistributionMessage?: proto.ISenderKeyDistributionMessage | null

        /** Message sendPaymentMessage. */
        public sendPaymentMessage?: proto.ISendPaymentMessage | null

        /** Message liveLocationMessage. */
        public liveLocationMessage?: proto.ILiveLocationMessage | null

        /** Message requestPaymentMessage. */
        public requestPaymentMessage?: proto.IRequestPaymentMessage | null

        /** Message declinePaymentRequestMessage. */
        public declinePaymentRequestMessage?: proto.IDeclinePaymentRequestMessage | null

        /** Message cancelPaymentRequestMessage. */
        public cancelPaymentRequestMessage?: proto.ICancelPaymentRequestMessage | null

        /** Message templateMessage. */
        public templateMessage?: proto.ITemplateMessage | null

        /** Message stickerMessage. */
        public stickerMessage?: proto.IStickerMessage | null

        /** Message groupInviteMessage. */
        public groupInviteMessage?: proto.IGroupInviteMessage | null

        /** Message templateButtonReplyMessage. */
        public templateButtonReplyMessage?: proto.ITemplateButtonReplyMessage | null

        /** Message productMessage. */
        public productMessage?: proto.IProductMessage | null

        /** Message deviceSentMessage. */
        public deviceSentMessage?: proto.IDeviceSentMessage | null

        /** Message deviceSyncMessage. */
        public deviceSyncMessage?: proto.IDeviceSyncMessage | null

        /**
         * Creates a new Message instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Message instance
         */
        public static create(properties?: proto.IMessage): proto.Message

        /**
         * Encodes the specified Message message. Does not implicitly {@link proto.Message.verify|verify} messages.
         * @param message Message message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified Message message, length delimited. Does not implicitly {@link proto.Message.verify|verify} messages.
         * @param message Message message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IMessage, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a Message message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Message

        /**
         * Decodes a Message message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Message
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Message

        /**
         * Verifies a Message message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a Message message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Message
         */
        public static fromObject(object: { [k: string]: any }): proto.Message

        /**
         * Creates a plain object from a Message message. Also converts values to other types if specified.
         * @param message Message
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.Message, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this Message to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a MessageKey. */
    interface IMessageKey {
        /** MessageKey remoteJid */
        remoteJid?: string | null

        /** MessageKey fromMe */
        fromMe?: boolean | null

        /** MessageKey id */
        id?: string | null

        /** MessageKey participant */
        participant?: string | null
    }

    /** Represents a MessageKey. */
    class MessageKey implements IMessageKey {
        /**
         * Constructs a new MessageKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IMessageKey)

        /** MessageKey remoteJid. */
        public remoteJid: string

        /** MessageKey fromMe. */
        public fromMe: boolean

        /** MessageKey id. */
        public id: string

        /** MessageKey participant. */
        public participant: string

        /**
         * Creates a new MessageKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MessageKey instance
         */
        public static create(properties?: proto.IMessageKey): proto.MessageKey

        /**
         * Encodes the specified MessageKey message. Does not implicitly {@link proto.MessageKey.verify|verify} messages.
         * @param message MessageKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IMessageKey, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified MessageKey message, length delimited. Does not implicitly {@link proto.MessageKey.verify|verify} messages.
         * @param message MessageKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IMessageKey, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a MessageKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.MessageKey

        /**
         * Decodes a MessageKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MessageKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.MessageKey

        /**
         * Verifies a MessageKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a MessageKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MessageKey
         */
        public static fromObject(object: { [k: string]: any }): proto.MessageKey

        /**
         * Creates a plain object from a MessageKey message. Also converts values to other types if specified.
         * @param message MessageKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.MessageKey, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this MessageKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a WebFeatures. */
    interface IWebFeatures {
        /** WebFeatures labelsDisplay */
        labelsDisplay?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures voipIndividualOutgoing */
        voipIndividualOutgoing?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures groupsV3 */
        groupsV3?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures groupsV3Create */
        groupsV3Create?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures changeNumberV2 */
        changeNumberV2?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures queryStatusV3Thumbnail */
        queryStatusV3Thumbnail?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures liveLocations */
        liveLocations?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures queryVname */
        queryVname?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures voipIndividualIncoming */
        voipIndividualIncoming?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures quickRepliesQuery */
        quickRepliesQuery?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures payments */
        payments?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures stickerPackQuery */
        stickerPackQuery?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures liveLocationsFinal */
        liveLocationsFinal?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures labelsEdit */
        labelsEdit?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures mediaUpload */
        mediaUpload?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures mediaUploadRichQuickReplies */
        mediaUploadRichQuickReplies?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures vnameV2 */
        vnameV2?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures videoPlaybackUrl */
        videoPlaybackUrl?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures statusRanking */
        statusRanking?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures voipIndividualVideo */
        voipIndividualVideo?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures thirdPartyStickers */
        thirdPartyStickers?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures frequentlyForwardedSetting */
        frequentlyForwardedSetting?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures groupsV4JoinPermission */
        groupsV4JoinPermission?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures recentStickers */
        recentStickers?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures catalog */
        catalog?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures starredStickers */
        starredStickers?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures voipGroupCall */
        voipGroupCall?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures templateMessage */
        templateMessage?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures templateMessageInteractivity */
        templateMessageInteractivity?: proto.WebFeatures.WEB_FEATURES_FLAG | null

        /** WebFeatures ephemeralMessages */
        ephemeralMessages?: proto.WebFeatures.WEB_FEATURES_FLAG | null
    }

    /** Represents a WebFeatures. */
    class WebFeatures implements IWebFeatures {
        /**
         * Constructs a new WebFeatures.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IWebFeatures)

        /** WebFeatures labelsDisplay. */
        public labelsDisplay: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures voipIndividualOutgoing. */
        public voipIndividualOutgoing: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures groupsV3. */
        public groupsV3: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures groupsV3Create. */
        public groupsV3Create: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures changeNumberV2. */
        public changeNumberV2: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures queryStatusV3Thumbnail. */
        public queryStatusV3Thumbnail: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures liveLocations. */
        public liveLocations: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures queryVname. */
        public queryVname: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures voipIndividualIncoming. */
        public voipIndividualIncoming: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures quickRepliesQuery. */
        public quickRepliesQuery: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures payments. */
        public payments: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures stickerPackQuery. */
        public stickerPackQuery: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures liveLocationsFinal. */
        public liveLocationsFinal: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures labelsEdit. */
        public labelsEdit: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures mediaUpload. */
        public mediaUpload: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures mediaUploadRichQuickReplies. */
        public mediaUploadRichQuickReplies: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures vnameV2. */
        public vnameV2: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures videoPlaybackUrl. */
        public videoPlaybackUrl: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures statusRanking. */
        public statusRanking: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures voipIndividualVideo. */
        public voipIndividualVideo: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures thirdPartyStickers. */
        public thirdPartyStickers: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures frequentlyForwardedSetting. */
        public frequentlyForwardedSetting: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures groupsV4JoinPermission. */
        public groupsV4JoinPermission: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures recentStickers. */
        public recentStickers: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures catalog. */
        public catalog: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures starredStickers. */
        public starredStickers: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures voipGroupCall. */
        public voipGroupCall: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures templateMessage. */
        public templateMessage: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures templateMessageInteractivity. */
        public templateMessageInteractivity: proto.WebFeatures.WEB_FEATURES_FLAG

        /** WebFeatures ephemeralMessages. */
        public ephemeralMessages: proto.WebFeatures.WEB_FEATURES_FLAG

        /**
         * Creates a new WebFeatures instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebFeatures instance
         */
        public static create(properties?: proto.IWebFeatures): proto.WebFeatures

        /**
         * Encodes the specified WebFeatures message. Does not implicitly {@link proto.WebFeatures.verify|verify} messages.
         * @param message WebFeatures message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IWebFeatures, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified WebFeatures message, length delimited. Does not implicitly {@link proto.WebFeatures.verify|verify} messages.
         * @param message WebFeatures message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IWebFeatures, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a WebFeatures message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebFeatures
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.WebFeatures

        /**
         * Decodes a WebFeatures message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebFeatures
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.WebFeatures

        /**
         * Verifies a WebFeatures message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a WebFeatures message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebFeatures
         */
        public static fromObject(object: { [k: string]: any }): proto.WebFeatures

        /**
         * Creates a plain object from a WebFeatures message. Also converts values to other types if specified.
         * @param message WebFeatures
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.WebFeatures, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this WebFeatures to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace WebFeatures {
        /** WEB_FEATURES_FLAG enum. */
        enum WEB_FEATURES_FLAG {
            NOT_STARTED = 0,
            FORCE_UPGRADE = 1,
            DEVELOPMENT = 2,
            PRODUCTION = 3,
        }
    }

    /** Properties of a TabletNotificationsInfo. */
    interface ITabletNotificationsInfo {
        /** TabletNotificationsInfo timestamp */
        timestamp?: number | Long | null

        /** TabletNotificationsInfo unreadChats */
        unreadChats?: number | null

        /** TabletNotificationsInfo notifyMessageCount */
        notifyMessageCount?: number | null

        /** TabletNotificationsInfo notifyMessage */
        notifyMessage?: proto.INotificationMessageInfo[] | null
    }

    /** Represents a TabletNotificationsInfo. */
    class TabletNotificationsInfo implements ITabletNotificationsInfo {
        /**
         * Constructs a new TabletNotificationsInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.ITabletNotificationsInfo)

        /** TabletNotificationsInfo timestamp. */
        public timestamp: number | Long

        /** TabletNotificationsInfo unreadChats. */
        public unreadChats: number

        /** TabletNotificationsInfo notifyMessageCount. */
        public notifyMessageCount: number

        /** TabletNotificationsInfo notifyMessage. */
        public notifyMessage: proto.INotificationMessageInfo[]

        /**
         * Creates a new TabletNotificationsInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TabletNotificationsInfo instance
         */
        public static create(properties?: proto.ITabletNotificationsInfo): proto.TabletNotificationsInfo

        /**
         * Encodes the specified TabletNotificationsInfo message. Does not implicitly {@link proto.TabletNotificationsInfo.verify|verify} messages.
         * @param message TabletNotificationsInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.ITabletNotificationsInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified TabletNotificationsInfo message, length delimited. Does not implicitly {@link proto.TabletNotificationsInfo.verify|verify} messages.
         * @param message TabletNotificationsInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.ITabletNotificationsInfo,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a TabletNotificationsInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TabletNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.TabletNotificationsInfo

        /**
         * Decodes a TabletNotificationsInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TabletNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.TabletNotificationsInfo

        /**
         * Verifies a TabletNotificationsInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a TabletNotificationsInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TabletNotificationsInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.TabletNotificationsInfo

        /**
         * Creates a plain object from a TabletNotificationsInfo message. Also converts values to other types if specified.
         * @param message TabletNotificationsInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.TabletNotificationsInfo,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this TabletNotificationsInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a NotificationMessageInfo. */
    interface INotificationMessageInfo {
        /** NotificationMessageInfo key */
        key?: proto.IMessageKey | null

        /** NotificationMessageInfo message */
        message?: proto.IMessage | null

        /** NotificationMessageInfo messageTimestamp */
        messageTimestamp?: number | Long | null

        /** NotificationMessageInfo participant */
        participant?: string | null
    }

    /** Represents a NotificationMessageInfo. */
    class NotificationMessageInfo implements INotificationMessageInfo {
        /**
         * Constructs a new NotificationMessageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.INotificationMessageInfo)

        /** NotificationMessageInfo key. */
        public key?: proto.IMessageKey | null

        /** NotificationMessageInfo message. */
        public message?: proto.IMessage | null

        /** NotificationMessageInfo messageTimestamp. */
        public messageTimestamp: number | Long

        /** NotificationMessageInfo participant. */
        public participant: string

        /**
         * Creates a new NotificationMessageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NotificationMessageInfo instance
         */
        public static create(properties?: proto.INotificationMessageInfo): proto.NotificationMessageInfo

        /**
         * Encodes the specified NotificationMessageInfo message. Does not implicitly {@link proto.NotificationMessageInfo.verify|verify} messages.
         * @param message NotificationMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.INotificationMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified NotificationMessageInfo message, length delimited. Does not implicitly {@link proto.NotificationMessageInfo.verify|verify} messages.
         * @param message NotificationMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(
            message: proto.INotificationMessageInfo,
            writer?: $protobuf.Writer,
        ): $protobuf.Writer

        /**
         * Decodes a NotificationMessageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NotificationMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.NotificationMessageInfo

        /**
         * Decodes a NotificationMessageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NotificationMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.NotificationMessageInfo

        /**
         * Verifies a NotificationMessageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a NotificationMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NotificationMessageInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.NotificationMessageInfo

        /**
         * Creates a plain object from a NotificationMessageInfo message. Also converts values to other types if specified.
         * @param message NotificationMessageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.NotificationMessageInfo,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this NotificationMessageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a WebNotificationsInfo. */
    interface IWebNotificationsInfo {
        /** WebNotificationsInfo timestamp */
        timestamp?: number | Long | null

        /** WebNotificationsInfo unreadChats */
        unreadChats?: number | null

        /** WebNotificationsInfo notifyMessageCount */
        notifyMessageCount?: number | null

        /** WebNotificationsInfo notifyMessages */
        notifyMessages?: proto.IWebMessageInfo[] | null
    }

    /** Represents a WebNotificationsInfo. */
    class WebNotificationsInfo implements IWebNotificationsInfo {
        /**
         * Constructs a new WebNotificationsInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IWebNotificationsInfo)

        /** WebNotificationsInfo timestamp. */
        public timestamp: number | Long

        /** WebNotificationsInfo unreadChats. */
        public unreadChats: number

        /** WebNotificationsInfo notifyMessageCount. */
        public notifyMessageCount: number

        /** WebNotificationsInfo notifyMessages. */
        public notifyMessages: proto.IWebMessageInfo[]

        /**
         * Creates a new WebNotificationsInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebNotificationsInfo instance
         */
        public static create(properties?: proto.IWebNotificationsInfo): proto.WebNotificationsInfo

        /**
         * Encodes the specified WebNotificationsInfo message. Does not implicitly {@link proto.WebNotificationsInfo.verify|verify} messages.
         * @param message WebNotificationsInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IWebNotificationsInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified WebNotificationsInfo message, length delimited. Does not implicitly {@link proto.WebNotificationsInfo.verify|verify} messages.
         * @param message WebNotificationsInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IWebNotificationsInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a WebNotificationsInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.WebNotificationsInfo

        /**
         * Decodes a WebNotificationsInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebNotificationsInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.WebNotificationsInfo

        /**
         * Verifies a WebNotificationsInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a WebNotificationsInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebNotificationsInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.WebNotificationsInfo

        /**
         * Creates a plain object from a WebNotificationsInfo message. Also converts values to other types if specified.
         * @param message WebNotificationsInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.WebNotificationsInfo,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this WebNotificationsInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    /** Properties of a PaymentInfo. */
    interface IPaymentInfo {
        /** PaymentInfo amount1000 */
        amount1000?: number | Long | null

        /** PaymentInfo receiverJid */
        receiverJid?: string | null

        /** PaymentInfo status */
        status?: proto.PaymentInfo.PAYMENT_INFO_STATUS | null

        /** PaymentInfo transactionTimestamp */
        transactionTimestamp?: number | Long | null

        /** PaymentInfo requestMessageKey */
        requestMessageKey?: proto.IMessageKey | null

        /** PaymentInfo expiryTimestamp */
        expiryTimestamp?: number | Long | null

        /** PaymentInfo futureproofed */
        futureproofed?: boolean | null

        /** PaymentInfo currency */
        currency?: string | null
    }

    /** Represents a PaymentInfo. */
    class PaymentInfo implements IPaymentInfo {
        /**
         * Constructs a new PaymentInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IPaymentInfo)

        /** PaymentInfo amount1000. */
        public amount1000: number | Long

        /** PaymentInfo receiverJid. */
        public receiverJid: string

        /** PaymentInfo status. */
        public status: proto.PaymentInfo.PAYMENT_INFO_STATUS

        /** PaymentInfo transactionTimestamp. */
        public transactionTimestamp: number | Long

        /** PaymentInfo requestMessageKey. */
        public requestMessageKey?: proto.IMessageKey | null

        /** PaymentInfo expiryTimestamp. */
        public expiryTimestamp: number | Long

        /** PaymentInfo futureproofed. */
        public futureproofed: boolean

        /** PaymentInfo currency. */
        public currency: string

        /**
         * Creates a new PaymentInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PaymentInfo instance
         */
        public static create(properties?: proto.IPaymentInfo): proto.PaymentInfo

        /**
         * Encodes the specified PaymentInfo message. Does not implicitly {@link proto.PaymentInfo.verify|verify} messages.
         * @param message PaymentInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IPaymentInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified PaymentInfo message, length delimited. Does not implicitly {@link proto.PaymentInfo.verify|verify} messages.
         * @param message PaymentInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IPaymentInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a PaymentInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PaymentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.PaymentInfo

        /**
         * Decodes a PaymentInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PaymentInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.PaymentInfo

        /**
         * Verifies a PaymentInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a PaymentInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PaymentInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.PaymentInfo

        /**
         * Creates a plain object from a PaymentInfo message. Also converts values to other types if specified.
         * @param message PaymentInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: proto.PaymentInfo, options?: $protobuf.IConversionOptions): { [k: string]: any }

        /**
         * Converts this PaymentInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace PaymentInfo {
        /** PAYMENT_INFO_STATUS enum. */
        enum PAYMENT_INFO_STATUS {
            UNKNOWN_STATUS = 0,
            PROCESSING = 1,
            SENT = 2,
            NEED_TO_ACCEPT = 3,
            COMPLETE = 4,
            COULD_NOT_COMPLETE = 5,
            REFUNDED = 6,
            EXPIRED = 7,
            REJECTED = 8,
            CANCELLED = 9,
            WAITING_FOR_PAYER = 10,
            WAITING = 11,
        }
    }

    /** Properties of a WebMessageInfo. */
    interface IWebMessageInfo {
        /** WebMessageInfo key */
        key: proto.IMessageKey

        /** WebMessageInfo message */
        message?: proto.IMessage | null

        /** WebMessageInfo messageTimestamp */
        messageTimestamp?: number | Long | null

        /** WebMessageInfo status */
        status?: proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS | null

        /** WebMessageInfo participant */
        participant?: string | null

        /** WebMessageInfo ignore */
        ignore?: boolean | null

        /** WebMessageInfo starred */
        starred?: boolean | null

        /** WebMessageInfo broadcast */
        broadcast?: boolean | null

        /** WebMessageInfo pushName */
        pushName?: string | null

        /** WebMessageInfo mediaCiphertextSha256 */
        mediaCiphertextSha256?: Uint8Array | null

        /** WebMessageInfo multicast */
        multicast?: boolean | null

        /** WebMessageInfo urlText */
        urlText?: boolean | null

        /** WebMessageInfo urlNumber */
        urlNumber?: boolean | null

        /** WebMessageInfo messageStubType */
        messageStubType?: proto.WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE | null

        /** WebMessageInfo clearMedia */
        clearMedia?: boolean | null

        /** WebMessageInfo messageStubParameters */
        messageStubParameters?: string[] | null

        /** WebMessageInfo duration */
        duration?: number | null

        /** WebMessageInfo labels */
        labels?: string[] | null

        /** WebMessageInfo paymentInfo */
        paymentInfo?: proto.IPaymentInfo | null

        /** WebMessageInfo finalLiveLocation */
        finalLiveLocation?: proto.ILiveLocationMessage | null

        /** WebMessageInfo quotedPaymentInfo */
        quotedPaymentInfo?: proto.IPaymentInfo | null

        /** WebMessageInfo ephemeralStartTimestamp */
        ephemeralStartTimestamp?: number | Long | null

        /** WebMessageInfo ephemeralDuration */
        ephemeralDuration?: number | null
    }

    /** Represents a WebMessageInfo. */
    class WebMessageInfo implements IWebMessageInfo {
        /**
         * Constructs a new WebMessageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: proto.IWebMessageInfo)

        /** WebMessageInfo key. */
        public key: proto.IMessageKey

        /** WebMessageInfo message. */
        public message?: proto.IMessage | null

        /** WebMessageInfo messageTimestamp. */
        public messageTimestamp: number | Long

        /** WebMessageInfo status. */
        public status: proto.WebMessageInfo.WEB_MESSAGE_INFO_STATUS

        /** WebMessageInfo participant. */
        public participant: string

        /** WebMessageInfo ignore. */
        public ignore: boolean

        /** WebMessageInfo starred. */
        public starred: boolean

        /** WebMessageInfo broadcast. */
        public broadcast: boolean

        /** WebMessageInfo pushName. */
        public pushName: string

        /** WebMessageInfo mediaCiphertextSha256. */
        public mediaCiphertextSha256: Uint8Array

        /** WebMessageInfo multicast. */
        public multicast: boolean

        /** WebMessageInfo urlText. */
        public urlText: boolean

        /** WebMessageInfo urlNumber. */
        public urlNumber: boolean

        /** WebMessageInfo messageStubType. */
        public messageStubType: proto.WebMessageInfo.WEB_MESSAGE_INFO_STUBTYPE

        /** WebMessageInfo clearMedia. */
        public clearMedia: boolean

        /** WebMessageInfo messageStubParameters. */
        public messageStubParameters: string[]

        /** WebMessageInfo duration. */
        public duration: number

        /** WebMessageInfo labels. */
        public labels: string[]

        /** WebMessageInfo paymentInfo. */
        public paymentInfo?: proto.IPaymentInfo | null

        /** WebMessageInfo finalLiveLocation. */
        public finalLiveLocation?: proto.ILiveLocationMessage | null

        /** WebMessageInfo quotedPaymentInfo. */
        public quotedPaymentInfo?: proto.IPaymentInfo | null

        /** WebMessageInfo ephemeralStartTimestamp. */
        public ephemeralStartTimestamp: number | Long

        /** WebMessageInfo ephemeralDuration. */
        public ephemeralDuration: number

        /**
         * Creates a new WebMessageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebMessageInfo instance
         */
        public static create(properties?: proto.IWebMessageInfo): proto.WebMessageInfo

        /**
         * Encodes the specified WebMessageInfo message. Does not implicitly {@link proto.WebMessageInfo.verify|verify} messages.
         * @param message WebMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: proto.IWebMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Encodes the specified WebMessageInfo message, length delimited. Does not implicitly {@link proto.WebMessageInfo.verify|verify} messages.
         * @param message WebMessageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: proto.IWebMessageInfo, writer?: $protobuf.Writer): $protobuf.Writer

        /**
         * Decodes a WebMessageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.WebMessageInfo

        /**
         * Decodes a WebMessageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebMessageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.WebMessageInfo

        /**
         * Verifies a WebMessageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): string | null

        /**
         * Creates a WebMessageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebMessageInfo
         */
        public static fromObject(object: { [k: string]: any }): proto.WebMessageInfo

        /**
         * Creates a plain object from a WebMessageInfo message. Also converts values to other types if specified.
         * @param message WebMessageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(
            message: proto.WebMessageInfo,
            options?: $protobuf.IConversionOptions,
        ): { [k: string]: any }

        /**
         * Converts this WebMessageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any }
    }

    namespace WebMessageInfo {
        /** WEB_MESSAGE_INFO_STATUS enum. */
        enum WEB_MESSAGE_INFO_STATUS {
            ERROR = 0,
            PENDING = 1,
            SERVER_ACK = 2,
            DELIVERY_ACK = 3,
            READ = 4,
            PLAYED = 5,
        }

        /** WEB_MESSAGE_INFO_STUBTYPE enum. */
        enum WEB_MESSAGE_INFO_STUBTYPE {
            UNKNOWN = 0,
            REVOKE = 1,
            CIPHERTEXT = 2,
            FUTUREPROOF = 3,
            NON_VERIFIED_TRANSITION = 4,
            UNVERIFIED_TRANSITION = 5,
            VERIFIED_TRANSITION = 6,
            VERIFIED_LOW_UNKNOWN = 7,
            VERIFIED_HIGH = 8,
            VERIFIED_INITIAL_UNKNOWN = 9,
            VERIFIED_INITIAL_LOW = 10,
            VERIFIED_INITIAL_HIGH = 11,
            VERIFIED_TRANSITION_ANY_TO_NONE = 12,
            VERIFIED_TRANSITION_ANY_TO_HIGH = 13,
            VERIFIED_TRANSITION_HIGH_TO_LOW = 14,
            VERIFIED_TRANSITION_HIGH_TO_UNKNOWN = 15,
            VERIFIED_TRANSITION_UNKNOWN_TO_LOW = 16,
            VERIFIED_TRANSITION_LOW_TO_UNKNOWN = 17,
            VERIFIED_TRANSITION_NONE_TO_LOW = 18,
            VERIFIED_TRANSITION_NONE_TO_UNKNOWN = 19,
            GROUP_CREATE = 20,
            GROUP_CHANGE_SUBJECT = 21,
            GROUP_CHANGE_ICON = 22,
            GROUP_CHANGE_INVITE_LINK = 23,
            GROUP_CHANGE_DESCRIPTION = 24,
            GROUP_CHANGE_RESTRICT = 25,
            GROUP_CHANGE_ANNOUNCE = 26,
            GROUP_PARTICIPANT_ADD = 27,
            GROUP_PARTICIPANT_REMOVE = 28,
            GROUP_PARTICIPANT_PROMOTE = 29,
            GROUP_PARTICIPANT_DEMOTE = 30,
            GROUP_PARTICIPANT_INVITE = 31,
            GROUP_PARTICIPANT_LEAVE = 32,
            GROUP_PARTICIPANT_CHANGE_NUMBER = 33,
            BROADCAST_CREATE = 34,
            BROADCAST_ADD = 35,
            BROADCAST_REMOVE = 36,
            GENERIC_NOTIFICATION = 37,
            E2E_IDENTITY_CHANGED = 38,
            E2E_ENCRYPTED = 39,
            CALL_MISSED_VOICE = 40,
            CALL_MISSED_VIDEO = 41,
            INDIVIDUAL_CHANGE_NUMBER = 42,
            GROUP_DELETE = 43,
            GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE = 44,
            CALL_MISSED_GROUP_VOICE = 45,
            CALL_MISSED_GROUP_VIDEO = 46,
            PAYMENT_CIPHERTEXT = 47,
            PAYMENT_FUTUREPROOF = 48,
            PAYMENT_TRANSACTION_STATUS_UPDATE_FAILED = 49,
            PAYMENT_TRANSACTION_STATUS_UPDATE_REFUNDED = 50,
            PAYMENT_TRANSACTION_STATUS_UPDATE_REFUND_FAILED = 51,
            PAYMENT_TRANSACTION_STATUS_RECEIVER_PENDING_SETUP = 52,
            PAYMENT_TRANSACTION_STATUS_RECEIVER_SUCCESS_AFTER_HICCUP = 53,
            PAYMENT_ACTION_ACCOUNT_SETUP_REMINDER = 54,
            PAYMENT_ACTION_SEND_PAYMENT_REMINDER = 55,
            PAYMENT_ACTION_SEND_PAYMENT_INVITATION = 56,
            PAYMENT_ACTION_REQUEST_DECLINED = 57,
            PAYMENT_ACTION_REQUEST_EXPIRED = 58,
            PAYMENT_ACTION_REQUEST_CANCELLED = 59,
            BIZ_VERIFIED_TRANSITION_TOP_TO_BOTTOM = 60,
            BIZ_VERIFIED_TRANSITION_BOTTOM_TO_TOP = 61,
            BIZ_INTRO_TOP = 62,
            BIZ_INTRO_BOTTOM = 63,
            BIZ_NAME_CHANGE = 64,
            BIZ_MOVE_TO_CONSUMER_APP = 65,
            BIZ_TWO_TIER_MIGRATION_TOP = 66,
            BIZ_TWO_TIER_MIGRATION_BOTTOM = 67,
            OVERSIZED = 68,
            GROUP_CHANGE_NO_FREQUENTLY_FORWARDED = 69,
            GROUP_V4_ADD_INVITE_SENT = 70,
            GROUP_PARTICIPANT_ADD_REQUEST_JOIN = 71,
            CHANGE_EPHEMERAL_SETTING = 72,
        }
    }
}
