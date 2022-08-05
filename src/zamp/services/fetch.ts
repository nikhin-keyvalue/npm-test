import { fetch as fetchPolyfill } from 'whatwg-fetch';

// TODO: Tobe removed
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> =
  typeof window !== 'undefined' && 'fetch' in window ? window.fetch : fetchPolyfill;

export default fetch;
