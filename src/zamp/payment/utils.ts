import { OptionsType } from 'types';
import ZampError from 'error/ZampError';
import { OS } from 'constants/common';

function sanitizeSession(rawOptions: OptionsType) {
  if (!rawOptions || !rawOptions['session'] || !rawOptions['token'])
    throw new ZampError('ERROR', 'Invalid options.', 300);

  return {
    session: rawOptions.session,
    token: rawOptions.token,
    platform: rawOptions?.platform || 'Browser',
    onPaymentCompleted: rawOptions.onPaymentCompleted,
    onLoaded: rawOptions.onLoaded,
    onPaymentCancel: rawOptions.onPaymentCancel
  } as OptionsType;
}

function getDeviceOS() {
  const listOfOS = [OS.WINDOWS, OS.MAC, OS.LINUX];
  const userAgent = navigator.userAgent || navigator.vendor;

  if (userAgent) {
    if (/windows phone/i.test(userAgent)) return OS.WINDOWS_PHONE;
    else if (/Android/i.test(userAgent)) return OS.ANDROID;
    else if (/iPad|iPhone|iPod/.test(userAgent)) return OS.IOS;

    const currentOS = listOfOS.find((os) => userAgent.includes(os));

    if (currentOS) return currentOS;
  }

  return OS.NOT_AVAILABLE;
}

export { sanitizeSession, getDeviceOS };
