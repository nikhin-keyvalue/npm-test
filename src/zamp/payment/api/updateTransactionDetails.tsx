import { httpPatch } from 'zamp/services/http';
import { API_DOMAIN } from 'config';

const updateTransactionDetails = (
  data: { transaction_hash: string },
  paymentId: string,
  session: any
): Promise<any> => {
  const path = `${API_DOMAIN}/payments/${paymentId}`;

  return httpPatch<any>(
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

export default updateTransactionDetails;
