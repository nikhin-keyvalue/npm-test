import Zamp from 'sdk';
import { OptionsType } from 'types';

declare global {
  interface Window {
    ZampCheckout?: any;
  }
}

if (!window?.ZampCheckout)
  window.ZampCheckout = function (options: OptionsType) {
    return new Zamp(options);
  };

export default Zamp;
