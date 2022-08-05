import { httpPost } from 'zamp/services/http';
import { CreatePaymentResponse } from 'types';
import { API_DOMAIN } from 'config';

const postPayment = (data, session): Promise<CreatePaymentResponse | null> => {
  const path = `${API_DOMAIN}/payments`;

  return httpPost<CreatePaymentResponse>(
    {
      path,
      token: session.token,
      platform: session.platform,
      errorLevel: 'warn',
      errorMessage: 'ERROR: Unable to create payment'
    },
    data
  );
};

export default postPayment;
