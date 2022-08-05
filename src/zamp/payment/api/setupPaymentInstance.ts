import { httpGet } from 'zamp/services/http';
import { CheckoutSessionSetupResponse } from 'types';
import { API_DOMAIN } from 'config';

const setupPaymentInstance = (session: any): Promise<CheckoutSessionSetupResponse> => {
  const path = `${API_DOMAIN}/payment-sessions/${session.session}`;

  return httpGet<CheckoutSessionSetupResponse>({
    path,
    token: session.token,
    platform: session.platform,
    errorLevel: 'fatal',
    errorMessage: 'Cannot create payment instance.'
  });
};

export default setupPaymentInstance;
