import { httpGet } from 'zamp/services/http';
import { CheckoutSessionSetupResponse } from 'types';
import { API_DOMAIN } from 'config';

const getPaymentInstance = (session: any): Promise<CheckoutSessionSetupResponse> => {
  const path = `${API_DOMAIN}/payment-sessions/${session.session}`;

  const resp = httpGet<CheckoutSessionSetupResponse>({
    path,
    token: session.token,
    platform: session.platform,
    errorLevel: 'fatal',
    errorMessage: 'ERROR: Unable to fetch payment session'
  });

  return resp;
};

export default getPaymentInstance;
