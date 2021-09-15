import * as Crypto from "crypto";

const r = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70],
  a = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102];

const i = (e) => {
  for (var t = [], a = 0; a < e.length; a++) {
    var i = e[a];
    t.push(r[i >> 4], r[15 & i]);
  }
  return String.fromCharCode.apply(String, t);
};

const n = (e, t) => {
  var r = e.charCodeAt(t);
  return r <= 57 ? r - 48 : r <= 70 ? 10 + r - 65 : 10 + r - 97;
};

const s = (e) => {
  if (/[^0-9a-fA-F]/.test(e)) throw new Error(`"${e}" is not a valid hex`);
  return e;
};

const o = (e, t) => {
  for (var r = t - e.length, a = e, i = 0; i < r; i++) a = "0" + a;
  return a;
};

const l = (e) => {
  return "-" === e[0];
};

const d = (e) => {
  if (e > 4294967295 || e < -4294967296)
    throw new Error("uint32ToLowerCaseHex given number over 32 bits");
  return o((e >= 0 ? e : 4294967296 + e).toString(16), 8);
};

export const NUM_HEX_IN_LONG = 16;
export const HEX_LOWER = a;

export const randomHex = function (e) {
  var t = new Uint8Array(e);
  var bytes = Crypto.randomBytes(t.length);
  t.set(bytes);
  return i(t);
};

export const toHex = i;

export const toLowerCaseHex = function (e) {
  for (var t = [], r = 0; r < e.length; r++) {
    var i = e[r];
    t.push(a[i >> 4], a[15 & i]);
  }
  return String.fromCharCode.apply(String, t);
};

export const parseHex = function (e) {
  var t = s(e);
  if (t.length % 2 != 0)
    throw new Error(
      `parseHex given hex "${t}" which is not a multiple of 8-bits.`
    );
  for (
    var r = new Uint8Array(t.length >> 1), a = 0, i = 0;
    a < t.length;
    a += 2, i++
  )
    r[i] = (n(t, a) << 4) | n(t, a + 1);
  return r.buffer;
};

export const hexAt = n;
export const hexOrThrow = s;
export const bytesToBuffer = function (e) {
  var t = e.buffer;
  return 0 === e.byteOffset && e.length === t.byteLength
    ? t
    : t.slice(e.byteOffset, e.byteOffset + e.length);
};

export const bytesToDebugString = function (e) {
  var t = !0,
    r = e.length;
  for (; t && r; ) {
    var a = e[--r];
    t = 32 <= a && a < 127;
  }
  return t ? JSON.stringify(String.fromCharCode.apply(String, e)) : i(e);
};

export const createHexLong = function (e, t = !1) {
  var r = s(e);
  return (
    (function (e, t) {
      if (e.length > t) throw new Error(`"${e}" is longer than ${4 * t} bits.`);
    })(r, 16),
    `${t ? "-" : ""}0x${o(r, 16)}`
  );
};

export const createHexLongFrom32Bits = function (e, t, r = !1) {
  var a = d(e),
    i = d(t);
  return `${r ? "-" : ""}0x${a}${i}`;
};

export const hexLongToHex = function (e) {
  return e.substring(e.indexOf("0x") + 2);
};

export const hexLongIsNegative = l;

export const negateHexLong = function (e) {
  return l(e) ? e.slice(1) : "-" + e;
};
