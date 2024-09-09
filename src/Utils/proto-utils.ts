import Pbf from 'pbf'

type WriteFunction<T extends object> = (obj: T, pbf: Pbf) => void;

export const writeBinaryNode = <T extends object>(writeFunction: WriteFunction<T>, obj: T): Uint8Array => {
	const pbf = new Pbf()
	writeFunction(obj, pbf)
	return pbf.finish()
}

type ReadFunction<T extends object> = (pbf: Pbf, end?: number) => T;

export const readBinaryNode = <T extends object>(readFunction: ReadFunction<T>, data: Uint8Array | Buffer): T => {
	return readFunction(new Pbf(data))
}
