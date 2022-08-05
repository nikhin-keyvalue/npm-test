/* eslint-disable curly */
import { sanitizeSession } from 'zamp/payment/utils';
import { OptionsType } from 'types';

class ZampCheckout {
  public options: OptionsType;
  public node;

  constructor(options) {
    this.options = sanitizeSession(options);
  }

  public initialize() {
    if (this.options) {
      this.options.onLoaded();
      const node = document.getElementById('zamp-checkout-btn');

      if (!node) throw new Error('Component could not mount. Root node was not found.');
      if (this.node) throw new Error('Component is already mounted.');
    }

    const payload = {
      session: this.options.session,
      token: this.options.token
    };

    const string = JSON.stringify(payload);
    const enc = btoa(string);

    window.location.href = `${process.env.PAYMENT_PAGE_URL}?payment-details=${enc} `;
  }
}

export default ZampCheckout;
