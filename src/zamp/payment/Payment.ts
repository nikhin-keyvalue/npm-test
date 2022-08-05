import {
  OptionsType,
  CheckoutSessionSetupResponse,
  PaymentInfo,
  ConnectionInformation,
  CreatePaymentResponse,
  BTCQRCodeResponse
} from 'types';

import { sanitizeSession } from './utils';
import getPaymentInstance from './api/getPaymentInstance';
import fetchConfig from './api/fetchConfig';
import updatePaymentInstance from './api/updatePaymentSession';
import getPayment from './api/getPayment';
import postPayment from './api/postPayment';
import updateTransactionDetails from './api/updateTransactionDetails';
import getBtcQrCode from './api/getBTCQRCode';

class Payment {
  public session: string;
  public token: string;
  public platform: string;

  constructor(rawOptions: OptionsType) {
    const options = sanitizeSession(rawOptions);

    this.session = options?.session;
    this.token = options?.token;
    this.platform = options?.platform;

    this.getPaymentInstance = this.getPaymentInstance.bind(this);
    this.getMerchantConfig = this.getMerchantConfig.bind(this);
    this.updatePaymentInstance = this.updatePaymentInstance.bind(this);
    this.getPayment = this.getPayment.bind(this);
    this.postPayment = this.postPayment.bind(this);
    this.updateTransactionDetails = this.updateTransactionDetails.bind(this);
    this.getBtcQrCode = this.getBtcQrCode.bind(this);
  }

  async getPaymentInstance(): Promise<PaymentInfo> {
    const sessionRes = await getPaymentInstance(this);

    return sessionRes.data;
  }

  async getMerchantConfig(): Promise<any | null> {
    const merchantConfig = await fetchConfig(this);

    return merchantConfig.data;
  }

  async updatePaymentInstance(data: ConnectionInformation): Promise<CheckoutSessionSetupResponse | null> {
    const walletRes = await updatePaymentInstance(data, this);

    return walletRes;
  }

  async getPayment(paymentId: string): Promise<CreatePaymentResponse | null> {
    const resp = await getPayment(paymentId, this);

    return resp;
  }

  async postPayment(data: string): Promise<CreatePaymentResponse | null> {
    const payload = { currency_code: data, payment_session_id: this.session };
    const paymentRes = await postPayment(payload, this);

    return paymentRes;
  }

  async updateTransactionDetails(data, paymentId): Promise<PaymentInfo> {
    const resp = await updateTransactionDetails(data, paymentId, this);

    return resp;
  }

  async getBtcQrCode(paymentId: string): Promise<BTCQRCodeResponse | null> {
    const resp = await getBtcQrCode(paymentId, this);

    return resp;
  }
}

export default Payment;
