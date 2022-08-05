// ESLINT disables are needed
/* eslint-disable no-undef */

const REDIRECT_URLS = {
  local: 'http://localhost:4000/',
  development: 'https://merchant.dev.zamplabs.com/',
  staging: 'https://merchant.stg.zamplabs.com/',
  production: 'https://merchant.zamplabs.com/'
};

window.onload = function () {
  const onPaymentCompleted = ({ status }) => {
    const checkoutPage = document.getElementById('checkout');
    const successPage = document.getElementById('success');
    const failurePage = document.getElementById('failure');

    checkoutPage.style.display = 'none';
    if (status === 'success') successPage.style.display = 'block';
    else failurePage.style.display = 'block';
  };

  const onBackButtonClick = () => {
    window.location.href = `${REDIRECT_URLS[process.env.ENV]}${getUrlParam()}`;
  };

  const getUrlParam = () => {
    const params = new URLSearchParams(window.location.href);
    let paramKey = '';

    params.forEach((key) => {
      paramKey = key;
    });

    return paramKey;
  };

  const getPageType = () => {
  const url = window.location.href;
    const redirectUrl = REDIRECT_URLS[process.env.ENV];
    const pageType = url.substring(url.indexOf(redirectUrl) + redirectUrl.length).split('/')[0];

    return pageType;
  };

   const backButtonElement = document.getElementById('back-button');

  if (backButtonElement) backButtonElement.addEventListener('click', onBackButtonClick);

  const onPaymentCancel = () => {
    console.log('Payment Cancelled');
  };

  const onLoaded = () => {
    loader.setAttribute('style', 'display: none');
  };

  document.getElementById('amount')?.addEventListener('keydown', function (event) {
    const check = (!(event.key === '-' || event.key === '+')) && (event.keyCode === 8 || /^\d*([.,]\d{0,1})?$/.test(this.value));

    if (!check) event.preventDefault();
  });

  document.getElementById('btn').addEventListener('click', function () {
    let amount = 1.00;

    const amountEl = document.getElementById('amount');

    if (amountEl) amount = amountEl.value;

    const loader = document.getElementById('loader');

    loader.setAttribute('style', 'display: block');

    const data = {
      reference_id: 'probo_12345678',
      merchant_id: process.env.MERCHANT_ID,
      source_amount: +amount,
      source_currency: 'USD',
      redirect_urls: {
        confirmUrl: `${REDIRECT_URLS[process.env.ENV]}completed?type=${getPageType()}`,
        failUrl: `${REDIRECT_URLS[process.env.ENV]}failed?type=${getPageType()}`
      },
      country_code: 'IN'
    };

    // TODO: Read from merchant
    const encryptKey = 'AAAAB3NzaC1yc2EAAAADAQABAAABgQDH+JI6oUoPD6FLZdzLrUWBhd';

    const stringifiedData = JSON.stringify(data) + encryptKey;
    const encrytedData = window.CryptoJS.SHA256(stringifiedData);
    var encodedData = window.CryptoJS.enc.Base64.stringify(encrytedData);

    console.log(encodedData);

    fetch(`https://${process.env.API_DOMAIN}/payment-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Zmp-Merchantsignature': `${encodedData}`,
        'X-Zmp-Clientid': process.env.MERCHANT_ID
      },
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .then((res) => {
        console.log(res.data);

        const payload = {
          session: res.data.id,
          token: res.data.token,
          onPaymentCompleted,
          onPaymentCancel,
          onLoaded
        };

        const zamp = new ZampCheckout(payload);

        zamp.initialize();
      });
  });
};
