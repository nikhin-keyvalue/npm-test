import Preact, { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Timer from 'ui/components/timer/Timer';
import { copyToClipBoard } from 'ui/utils/common';
import { APIErrorCode, ModalTypes, Wallets, ZampfiPages } from 'constants/common';
import { BitCoinScreenProps } from 'types';
import { ASSETS_PATH } from 'config';

import './styles.scss';

const BitCoinScreen: Preact.FunctionComponent<BitCoinScreenProps> = ({
  totalPrice,
  currencyType,
  BTCConnectionInfo,
  convertedAmounts,
  onWalletConnected,
  createPayment,
  isLoading,
  paymentPoll,
  setCurrentPage,
  setModalOpen,
  setLoading,
  getQRCode,
  clearValues,
  maxTimeLimit,
  paymentTimeLimit,
  startTimer
}) => {
  const [bitCoinAddress, setBitCoinAddress] = useState('');
  const [bitCoinAmount, setBitCoinAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [QRCode, setQRCode] = useState('');

  useEffect(() => {
    (async () => {
      await onWalletConnected(BTCConnectionInfo, Wallets.BTC);
    })();

    return () => {
      clearValues();
    };
  }, []);

  useEffect(() => {
    if (convertedAmounts?.length)
      (async () => {
        const resp = await createPayment(convertedAmounts[0].currency_code);

        if (resp?.data) {
          setBitCoinAddress(resp.data.dest_account);
          setBitCoinAmount(resp.data.amount);
          setCurrency(resp.data.currency_code);
          const QRResp = await getQRCode(resp.data.id);

          if (QRResp) setQRCode(QRResp?.data.qrcode);
          await paymentPoll(resp.data.id);
          setLoading(false);
        } else if (resp?.error && resp.error.code === APIErrorCode.NO_BURNER_WALLET) {
          setModalOpen(ModalTypes.NO_BURNER_WALLET);
        } else {
          setCurrentPage(ZampfiPages.ERROR_SCREEN);
        }
        setLoading(false);
      })();
  }, [convertedAmounts]);

  return (
    <div className='zamp-bit-coin-container'>
      {!isLoading ? (
        <div className='zamp-bit-coin-payment-details-container'>
          <div className='zamp-bit-coin-payment-amount-header-container'>
            <div className='zamp-bit-coin-payment-amount'>
              {bitCoinAmount} {currency || 'BTC'}
            </div>
            <img
              className='zamp-bit-coin-copy-icon'
              src={`${ASSETS_PATH}/public/images/copy-icon.svg`}
              alt='Copy icon'
              width={16}
              height={16}
              style={{ marginLeft: '13px' }}
              role='presentation'
              onClick={() => copyToClipBoard(bitCoinAmount)}
            />
          </div>
          <div className='zamp-bit-coin-payment-details'>
            <div>Total Price</div>
            <div>
              {totalPrice} {currencyType}
            </div>
          </div>
          <div className='zamp-bit-coin-payment-details'>
            <div>Exchange Rate</div>
            <div>
              {convertedAmounts?.length && `${convertedAmounts[0].amount} ${convertedAmounts[0].currency_code}`}
            </div>
          </div>
          <hr></hr>
          <div className='zamp-bit-coin-payment-details'>
            <div>Subtotal</div>
            <div>
              {bitCoinAmount} {currency || 'BTC'}
            </div>
          </div>
          <div className='zamp-bit-coin-qr-code-container'>
            <div className='zamp-bit-coin-qr-code-header'>Send to Wallet address</div>
            <div className='zamp-bit-coin-qr-code-wallet-address'>
              <div className='zamp-bit-coin-qr-code-wallet-address-text'>{bitCoinAddress}</div>
              <img
                className='zamp-bit-coin-copy-icon'
                src={`${ASSETS_PATH}/public/images/copy-icon.svg`}
                alt='Copy icon'
                width={16}
                height={16}
                role='presentation'
                onClick={() => copyToClipBoard(bitCoinAddress || '')}
              />
            </div>
            <span className='zamp-bit-coin-qr-code-scan-header'>or Scan the QR Code</span>
            <div className='qr-image-container'>
              <img src={QRCode} alt='QR code' />
            </div>
            <div className='zamp-bit-coin-timer-container'>
              <Timer
                totalTimeDuration={maxTimeLimit}
                currentTime={paymentTimeLimit}
                startTimer={startTimer}
                timerText={'Remaining'}
                styleOffset={true}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BitCoinScreen;
