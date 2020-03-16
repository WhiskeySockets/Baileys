declare function hkdf(
  ikm: Buffer | string,
  length: number,
  option?: hkdf.Options
): Buffer;

declare namespace hkdf {
  interface Options {
    salt?: Buffer | string;
    info?: Buffer | string;
    hash?: string;
  }
  export function hash_length(hash: string): number;
  export function extract(
    hash: string,
    hash_len: number,
    ikm: Buffer | string,
    salt: Buffer | string
  ): Buffer;
  export function expand(
    hash: string,
    hash_len: number,
    prk: Buffer | string,
    length: number,
    info: Buffer | string
  ): Buffer;
}

export = hkdf;
