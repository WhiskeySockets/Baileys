import { downloadContentFromMessage } from "./messages-media";
import { proto } from "../../WAProto";
import { promisify } from 'util'
import { inflate } from "zlib";

const inflatePromise = promisify(inflate)

export const downloadHistory = async(msg: proto.IHistorySyncNotification) => {
	const stream = await downloadContentFromMessage(msg, 'history')
	let buffer = Buffer.from([])
	for await(const chunk of stream) {
		buffer = Buffer.concat([buffer, chunk])
	}
	// decompress buffer
	buffer = await inflatePromise(buffer)

	const syncData = proto.HistorySync.decode(buffer)
	return syncData
}