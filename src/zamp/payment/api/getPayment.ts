import { httpGet } from 'zamp/services/http';
import { CreatePaymentResponse } from 'types';
import { API_DOMAIN } from 'config';

const getPayment = (paymentId: string, session: any): Promise<CreatePaymentResponse | null> => {
  const path = `${API_DOMAIN}/payments/${paymentId}`;

  const resp = httpGet<CreatePaymentResponse>({
    path,
    token: session.token,
    platform: session.platform,
    errorLevel: 'error',
    errorMessage: 'ERROR: Unable to fetch payment session'
  });

  return resp;
};

export default getPayment;
