import { h, Component } from 'preact';

import { PaymentStatus } from 'types';
import Zamp from '..';
import Payment from 'zamp/payment/Payment';

import Page from './page';

import './styles.scss';

// Types for props
type Props = {
  zampSession: Zamp;
  paymentSession: Payment;
  onPaymentCompleted: (payload: PaymentStatus) => void;
  onPaymentCancel: () => void;
};

// Types for state
type State = {
  error: boolean | null;
};

type Error = {
  message: string;
};

class ZampCheckout extends Component<Props, State> {
  public state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  componentDidCatch(error) {
    this.setState({ error: error });
    console.log(error);
  }

  render(props) {
    return (
      <div className='zamp-checkout-page-content'>
        <Page
          paymentSession={props.paymentSession}
          zampSession={props.zampSession}
          onPaymentCompleted={props.onPaymentCompleted}
          onPaymentCancel={props.onPaymentCancel}
          isError={!!this.state.error}
        />
      </div>
    );
  }
}

export default ZampCheckout;
