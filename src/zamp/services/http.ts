import { HttpOptions, ErrorLevel } from 'types';
import ZampError from 'error/ZampError';
import { getDeviceOS } from 'zamp/payment/utils';
import { SDK_VERSION } from 'config';

import fetch from './fetch';

export function http<T>(options: HttpOptions, data: any): Promise<T> {
  const {
    headers = [],
    errorLevel = 'warn',
    loadingContext = 'https://',
    method = 'GET',
    path,
    token,
    platform
  } = options;

  const request: RequestInit = {
    method,
    mode: 'cors',
    cache: 'default',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': method === 'POST' ? 'application/json' : 'text/plain',
      Authorization: `Bearer ${token}`,
      'X-Zmp-Platform': platform,
      'X-Zmp-OS': getDeviceOS(),
      'X-Zmp-Sdkversion': SDK_VERSION,
      ...headers
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer-when-downgrade',
    ...(data &&
      (method === 'POST' || method === 'PATCH') && {
        body: JSON.stringify(data)
      })
  };

  const url = `${loadingContext}${path}`;

  return fetch(url, request)
    .then(async (response) => {
      const data = await response.json();

      if (response.ok) return data;

      handleFetchError(options.errorMessage || `Service at ${url} is not available`, errorLevel);

      return data;
    })
    .catch(() => {
      handleFetchError(options.errorMessage || `Service at ${url} is not available`, errorLevel);

      return null;
    });
}

function handleFetchError(message: string, level: ErrorLevel): void {
  switch (level) {
    case 'silent': {
      break;
    }
    case 'info':
    case 'warn': {
      console[level](message);
      break;
    }
    case 'error':
      break;
    default:
      throw new ZampError('NETWORK_ERROR', message, 400);
  }
}

export function httpGet<T = any>(options: HttpOptions, data?: any): Promise<T> {
  return http<T>({ ...options, method: 'GET' }, data);
}

export function httpPost<T = any>(options: HttpOptions, data?: any): Promise<T> {
  return http<T>({ ...options, method: 'POST' }, data);
}

export function httpPatch<T = any>(options: HttpOptions, data?: any): Promise<T> {
  return http<T>({ ...options, method: 'PATCH' }, data);
}
