export type HexString = string;
export type ValueTypes = 'address' | 'bool' | 'string' | 'int256' | 'uint256' | 'bytes' | 'bigint';
export type Bytes = Buffer | Uint8Array | ArrayBuffer | HexString;
export type Numbers = number | bigint | string | HexString;
// Hex encoded 32 bytes
export type HexString32Bytes = HexString;
// Hex encoded 8 bytes
export type HexString8Bytes = HexString;
// Hex encoded 1 byte
export type HexStringSingleByte = HexString;
// Hex encoded 1 byte
export type HexStringBytes = HexString;
// Hex encoded 256 byte
export type HexString256Bytes = HexString;
// Hex encoded unsigned integer
export type Uint = HexString;
// Hex encoded unsigned integer 32 bytes
export type Uint256 = HexString;
// Hex encoded address
export type Address = HexString;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type EncodingTypes = Numbers | boolean | Numbers[] | boolean[];
export type TypedObject = {
	type: string;
	value: EncodingTypes;
};
export type TypedObjectAbbreviated = {
	t: string;
	v: EncodingTypes;
};