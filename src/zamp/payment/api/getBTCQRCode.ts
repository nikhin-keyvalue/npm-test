import { httpGet } from 'zamp/services/http';
import { BTCQRCodeResponse } from 'types';
import { API_DOMAIN } from 'config';

const getBtcQrCode = (paymentId: string, session: any): Promise<BTCQRCodeResponse> => {
  const path = `${API_DOMAIN}/payments/${paymentId}/qrcode`;

  const resp = httpGet<BTCQRCodeResponse>({
    path,
    token: session.token,
    platform: session.platform,
    errorLevel: 'error',
    errorMessage: 'ERROR: Unable to fetch QR code'
  });

  return resp;
};

export default getBtcQrCode;
