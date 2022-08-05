import { httpPatch } from 'zamp/services/http';
import { CheckoutSessionSetupResponse, ConnectionInformation } from 'types';
import { API_DOMAIN } from 'config';

const updatePaymentInstance = (data: ConnectionInformation, session: any): Promise<CheckoutSessionSetupResponse> => {
  const path = `${API_DOMAIN}/payment-sessions/${session.session}`;

  return httpPatch<CheckoutSessionSetupResponse>(
    {
      path,
      token: session.token,
      platform: session.platform,
      errorLevel: 'error',
      errorMessage: 'ERROR: Invalid session'
    },
    data
  );
};

export default updatePaymentInstance;
