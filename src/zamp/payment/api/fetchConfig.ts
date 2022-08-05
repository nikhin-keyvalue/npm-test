import { httpGet } from 'zamp/services/http';
import { CheckoutSessionSetupResponse } from 'types';
import { API_DOMAIN } from 'config';

const fetchConfig = (session: any): Promise<CheckoutSessionSetupResponse> => {
  const path = `${API_DOMAIN}/config`;

  const resp = httpGet<CheckoutSessionSetupResponse>({
    path,
    token: session.token,
    platform: session.platform,
    errorLevel: 'fatal',
    errorMessage: 'ERROR: Unable to fetch config'
  });

  console.log(resp);

  return resp;
};

export default fetchConfig;
