import Preact, { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { APIErrorCode, ModalTypes, ZampfiPages } from 'constants/common';
import { ASSETS_PATH } from 'config';
import { BinanceScreenProps } from 'types';
import { copyToClipBoard, isMobileDevice } from 'ui/utils/common';

import './styles.scss';

const BinanceScreen: Preact.FunctionComponent<BinanceScreenProps> = ({
  coinData,
  sourceCurrency,
  amount,
  createPayment,
  setLoading,
  setCurrentPage,
  setModalOpen,
  setShowBinanceTutorial,
  paymentPoll
}) => {
  const [binanceAddress, setBinanceAddress] = useState('');
  const [binanceAmount, setBinanceAmount] = useState('');

  useEffect(() => {
    setLoading(true);
    (async () => {
      const resp = await createPayment(coinData.currency_code);

      if (resp?.data) {
        setBinanceAddress(resp.data.dest_account);
        setBinanceAmount(resp.data.amount);
        await paymentPoll(resp.data.id);
      } else if (resp?.error && resp.error.code === APIErrorCode.NO_BURNER_WALLET) {
        setModalOpen(ModalTypes.NO_BURNER_WALLET);
      } else {
        setCurrentPage(ZampfiPages.ERROR_SCREEN);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className='zamp-binance-screen-container'>
      <div className='zamp-binance-screen-content'>
        <div className='zamp-binance-screen-title'>
          <div className='zamp-binance-screen-amount'>
            {`${Number(binanceAmount || coinData.amount).toFixed(5)} ${coinData.currency_code}`}
          </div>
          <img
            src={`${ASSETS_PATH}/public/images/copy-icon.svg`}
            alt='copy'
            onClick={() => copyToClipBoard(binanceAmount || coinData.amount)}
            role='presentation'
          />
        </div>
        <div className='zamp-binance-screen-rates-container'>
          <div className='zamp-binance-screen-price-row'>
            <div className='zamp-binance-screen-price-label'>Total Price</div>
            <div className='zamp-binance-screen-price-label'>{`${amount} ${sourceCurrency}`}</div>
          </div>
          <div className='zamp-binance-screen-price-row'>
            <div className='zamp-binance-screen-price-label'>Exchange Rate</div>
            <div className='zamp-binance-screen-price-label'>{`${coinData.exchange_rate} ${sourceCurrency}`}</div>
          </div>
        </div>
        <div className='zamp-binance-screen-sub-total'>
          <div className='zamp-binance-screen-price-label'>Subtotal</div>
          <div className='zamp-binance-screen-price-label'>{`${binanceAmount || coinData.amount} ${
            coinData.currency_code
          }`}</div>
        </div>
      </div>
      <div className='zamp-binance-send-content'>
        <div className='zamp-binance-screen-send-label'>Send to Wallet Address</div>
        <div className='zamp-binance-screen-address-container'>
          <div className='zamp-binance-screen-address-label'>{binanceAddress}</div>
          <img
            src={`${ASSETS_PATH}/public/images/copy-icon.svg`}
            alt='copy'
            onClick={() => copyToClipBoard(binanceAddress)}
            role='presentation'
          />
        </div>
      </div>
      {!isMobileDevice() && (
        <div className='zamp-binance-screen-buttons-container'>
          <div
            className='zamp-balance-screen-tutor-link'
            onClick={() => setShowBinanceTutorial(true)}
            role='presentation'
          >
            I need help to make payment
          </div>
        </div>
      )}
    </div>
  );
};

export default BinanceScreen;
