export interface Label {
	/** Label uniq ID */
	id: string
	/** Label name */
	name: string
	/** Label color ID */
	color: number
	/** Is label has been deleted */
	deleted: boolean
	/** WhatsApp has 5 predefined labels (New customer, New order & etc) */
	predefinedId?: string
}

export interface LabelActionBody {
	id: string
	/** Label name */
	name?: string
	/** Label color ID */
	color?: number
	/** Is label has been deleted */
	deleted?: boolean
	/** WhatsApp has 5 predefined labels (New customer, New order & etc) */
	predefinedId?: number
}

/** WhatsApp has 20 predefined colors */
export enum LabelColor {
	Color1 = 0,
	Color2,
	Color3,
	Color4,
	Color5,
	Color6,
	Color7,
	Color8,
	Color9,
	Color10,
	Color11,
	Color12,
	Color13,
	Color14,
	Color15,
	Color16,
	Color17,
	Color18,
	Color19,
	Color20
}
