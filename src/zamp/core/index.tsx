import { h, render, Component } from 'preact';

import { MerchantConfig, OptionsType, PaymentInfo } from 'types';
import Payment from 'zamp/payment/Payment';
import ZampCheckout from 'ui';
import Loader from 'ui/components/loader/Loader';
import { Platform, ZampfiActions } from 'constants/common';

class Zamp extends Component {
  public node: any;
  public options: OptionsType;
  public paymentInfo: PaymentInfo;
  public paymentSession: Payment;
  public merchantConfig: MerchantConfig;

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  state = { isReadyToRender: false, isError: false };

  componentDidMount() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = {};

    for (const [key, value] of urlSearchParams.entries()) params[key] = value;

    if (!params['payment-details']) {
      alert('Url params missing');

      return;
    }

    const decodedString = atob(params['payment-details']);
    const jsObject = JSON.parse(decodedString);

    this.options = jsObject;

    this.initialize();
  }

  public async initialize() {
    if (this.options)
      try {
        this.paymentSession = new Payment(this.options);
        this.paymentInfo = await this.paymentSession.getPaymentInstance();
        this.merchantConfig = await this.paymentSession.getMerchantConfig();
        this.setState({ isReadyToRender: true });
      } catch (err) {
        this.setState({ isError: true });

        return;
      }
  }

  onAction(action: ZampfiActions, data: any = null) {
    console.log(action, data, this);

    if (this.paymentSession.platform === Platform.SDK) {
      if ('Android' in window) window?.Android?.paymentComplete();
      else if ('IOS' in window) window?.IOS?.paymentComplete();
    } else {
      window.location.href =
        this.paymentInfo.redirect_urls[action === ZampfiActions.SUCCESS ? 'confirmUrl' : 'failUrl'];
    }
  }

  render() {
    return this.state.isReadyToRender ? (
      <ZampCheckout
        paymentSession={this.paymentSession}
        zampSession={this}
        onPaymentCompleted={(data) => this.onAction(ZampfiActions.SUCCESS, data)}
        onPaymentCancel={() => this.onAction(ZampfiActions.CANCEL)}
      />
    ) : this.state.isError ? (
      <div>Something went wrong!</div>
    ) : (
      <Loader />
    );
  }
}

window.addEventListener('load', () => {
  render(<Zamp />, document.body);
});
