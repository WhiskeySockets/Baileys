declare module 'node-fetch' {
  type RequestInfo = globalThis.RequestInfo;
  type HeadersInit = globalThis.HeadersInit;
  type BodyInit = globalThis.BodyInit;
  interface RequestInit extends globalThis.RequestInit {}
  interface Response extends globalThis.Response {}
  interface Headers extends globalThis.Headers {}
  interface Request extends globalThis.Request {}
  interface AbortSignal extends globalThis.AbortSignal {}

  const fetch: typeof globalThis.fetch;
  export { fetch };
  export default fetch;

  const Headers: typeof globalThis.Headers;
  const Request: typeof globalThis.Request;
  const Response: typeof globalThis.Response;
  const AbortController: typeof globalThis.AbortController;

  export { Headers, Request, Response, AbortController };
  export type { RequestInfo, RequestInit, HeadersInit, BodyInit, Response, Headers, Request, AbortSignal };
}
