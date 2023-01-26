namespace JSX {
	export type Timestamp = string; // unix timestamp in seconds since epoch: 1653237707
	export type JID = 's.whatsapp.net' | 'g.us' | `${string}@s.whatsapp.net` | `${string}@g.us`| string;
	export type XMLNS = | 'w:stats' 
		| 'urn:xmpp:whatsapp:push' 
		| 'urn:xmpp:whatsapp:account' 
		| 'urn:xmpp:whatsapp:mms' 
		| 'w:profile:picture' 
		| 'w:p' 
		| 'usync' 
		| 'w:g2' 
		| 'passive' 
		| 'urn:xmpp:whatsapp:dirty' 
		| 'encrypt' 
		| 'w:m' 
		| 'w:biz:catalog' 
		| 'fb:thrift_iq' 
		| 'privacy' 
		| 'status' 
		| 'blocklist' 
		| 'w:biz' 
		| 'w:sync:app:state'
		| 'abt'
		| 'w'
		| 'md'
	export const Fragment = '<></>'

	export function createElement(tag: string|Function, attrs = {}, ...content: any[]) {
		// eslint-disable-next-line eqeqeq
		if(attrs == null) {
			attrs = {}
		}
		if(typeof tag === 'function') {
			return tag(attrs, content)
		}

		return {
			tag,
			attrs,
			content: content.length === 0 ? undefined : content
		}
	}

	export interface IntrinsicElements {
		iq: {
			id?: string;
			type: 'get' | 'set' | 'result' | 'error';
			xmlns?: XMLNS
			to?: JID;
			target?: JID;
			smax_id?: string;
		};
		product_catalog: {
			jid: string
			allow_shop_source: string
		};
		collections: {
			biz_jid: string
		}
		sync: {}
		retailer_id: {}
		media: {}
		image: {}
		url: {}
		name: {}
		price: {}
		currency: {}
		compliance_info: {}
		country_code_origin: {}
		collection_limit: {}
		after: {}
		item_limit: {}
		limit: {}
		invite: {
			code?: string
		}
		ephemeral: {
			expiration: Timestamp
		}
		not_ephemeral: {}
		accept: {
			code: string
			expiration: Timestamp
			admin: JID
		}
		item: {
			id?: string
			jid?: JID
			action?: string
		}
		business_profile: {
			v: string
		}
		profile: {
			jid: JID
		}
		width: {}
		devices: {
			version: string
		}
		media_conn: {}
		height: {}
		blocklist: {}
		tokens: {}
		call: {
			from: JID
			to: JID
		}
		reject: {
			"call-id": string
			"call-creator": JID
			count: string
		}
		order: {
			op: "get"
			id: string
		}
		image_dimensions: {}
		product_catalog_edit: {
			v: string
		}
		product_catalog_add: {
			v: string
		}
		product_catalog_delete: {
			v: string
		}
		product: {}
		id: {}
		leave: {}
		body: {}
		subject: {}
		group: {
			id: string
		}
		create: {
			subject?: string
			key?: string
		}
		privacy: {}
		token: {
			jid?: JID
			t?: Timestamp
			type?: string
		}
		tctoken: {}
		result: {}
		"device-identity": {}
		"remove-companion-device": {
			jid: JID
			reason: string
		}
		props: {
			protocol?: string
		}
		presence: {
			id?: string
			name?: string;
			to?: JID;
			type?: 'subscribe' | 'unavailable' | 'available'
		};
		picture: {
			type: 'image' | string;
			query?: 'url' | 'preview';
		};
		collection: {
			name: string
			version: string
			return_snapshot: string
		}
		remove: {
			xmlns: string;
		};
		patch: {};
		count: {};
		ping: {};
		add: {
			t?: Timestamp;
			content?: any;
		};
		chatstate: {
			from: JID;
			to: JID;
		};
		config: {
			platform: 'web';
			endpoint: string;
			p256dh: string;
			auth: string;
		};
		ack: {
			id: string;
			to: string;
			class?: string;
			type?: string;
			participant?: string;
		};
		settings: {};
		list: {};
		key: {};
		keys: {};
		to: {
			jid: string;
		};
		identity: {};
		message: {
			id: string;
			type: string;
			to?: JID;
			edit?: '7';
		};
		enc: {
			v: string;
			type: string;
			content?: any;
		};
		type: {};
		usync: {
			sid: string;
			mode: 'query';
			last?: string;
			index?: string;
			context?: string;
		};
		participants: {}
		participant: {
			jid: JID
		}
		registration: {};
		participating: {};
		contact: {};
		status: {};
		user: {
			jid?: string;
		};
		active: {};
		description: {};
		receipt: {
			id: string;
			to?: string;
			participant?: string;
			type?: 'retry' | 'server-error';
			t?: JSX.Timestamp;
		};
		retry: {
			id?: string;
			t?: JSX.Timestamp;
			v?: string;
			count?: string;
		};
		clean: {
			type: string;
			timestamp?: Timestamp;
		};
		query: {
			request?: 'interactive';
		};
		encr_media: {
			hash: string;
			type: string;
			size: string;
		};
		encrypt: {}
		enc_p: {}
		"pair-device-sign": {}
		enc_iv: {}
		skey: {}
		value: {}
		signature: {}
		rmr: {
			jid: JID
			from_me: string
			participant?:JID
		}
	}
}

globalThis.JSX = JSX