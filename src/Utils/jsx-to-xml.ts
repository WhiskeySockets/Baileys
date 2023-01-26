namespace JSX {
	export type Timestamp = string; // unix timestamp in seconds since epoch: 1653237707
	export type JID = 's.whatsapp.net' | 'g.us' | `${string}@s.whatsapp.net` | `${string}@g.us`;
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
			content,
		}
	}

	export interface IntrinsicElements {
		iq: {
			type: 'get' | 'set';
			xmlns:
				| 'w:stats'
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
				| 'w:m';
			to?: JID;
			target?: JID;
		};
		presence: {
			name: string;
			to?: JID;
			type: 'subscribe' | 'unavailable' | 'available';
		};
		picture: {
			type: 'image';
			query: 'url' | 'preview';
		};
		remove: {
			xmlns: string;
		};
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
			to: JID;
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
		participants: {};
		registration: {};
		participating: {};
		user: {
			jid: string;
		};
		active: {};
		description: {};
		receipt: {
			id: string;
			to: string;
			participant?: string;
			type?: 'retry';
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
		};
		query: {
			request?: 'interactive';
		};
		encr_media: {
			hash: string;
			type: string;
			size: string;
		};
	}
}

globalThis.JSX = JSX