export enum ZampfiPages {
  WALLET_LIST = 'WALLET_LIST',
  COIN_LIST = 'COIN_LIST',
  BINANCE_SCREEN = 'BINANCE_SCREEN',
  SUCCESS_SCREEN = 'SUCCESS_SCREEN',
  PENDING_SCREEN = 'PENDING_SCREEN',
  ERROR_SCREEN = 'ERROR_SCREEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED'
}

export enum PaymentStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DISCONNECT = 'disconnect'
}

export enum ErrorType {
  PAYMENT_FAILED = 'payment-failed',
  TRANSACTION_FAILED = 'transaction-failed',
  GENERIC_ERROR = 'generic-error',
  INVALID_CHAIN = 'invalid-chain',
  METAMASK_PENDING_REQUEST = 'pending-request',
  NO_BURNER_WALLET = 'no-burner-wallet-available'
}

export enum HeaderPaymentStatus {
  PAYING = 'paying',
  PAID = 'paid'
}

export enum Wallets {
  METAMASK = 'Metamask',
  PHANTOM = 'Phantom',
  WALLETCONNECT = 'WalletConnect',
  BINANCE = 'Binance',
  BTC = 'QRCode'
}

export enum ModalTypes {
  WALLET_CONNECT = 'wallet-connect',
  WALLET_CONFIRM = 'wallet-confirm',
  WALLET_INSTALL = 'wallet-install',
  TIME_UP = 'time-up',
  CANNOT_PROCESS = 'cannot-process',
  GENERIC_ERROR = 'generic-error',
  INVALID_ACCOUNT = 'invalid-account',
  INVALID_CHAIN = 'invalid-chain',
  METAMASK_PENDING_REQUEST = 'pending-request',
  NO_BURNER_WALLET = 'no-burner-wallet-available'
}

export enum BottomSheetTypes {
  GO_BACK = 'go-back',
  PAYMENT_DETAILS = 'payment-details',
  NETWORK_SELECT = 'network-select'
}

export enum RiskScore {
  NOT_CONFIRMED = '',
  LOW_RISK = 'lowRisk',
  HIGH_RISK = 'highRisk',
  UNKNOWN = 'unknown'
}

export enum RiskStatus {
  NOT_CONFIRMED = '',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export const REDIRECT_URLS = {
  [Wallets.METAMASK]: 'https://metamask.app.link',
  [Wallets.PHANTOM]: 'https://phantom.app'
};

export enum Platform {
  SDK = 'SDK',
  BROWSER = 'Browser'
}

export enum OS {
  ANDROID = 'Android',
  WINDOWS = 'Windows',
  MAC = 'Mac',
  LINUX = 'Linux',
  WINDOWS_PHONE = 'Windows Phone',
  IOS = 'IOS',
  NOT_AVAILABLE = 'Not available'
}

export enum ENVTypes {
  LOCAL = 'local',
  DEV = 'development',
  STG = 'staging',
  PROD = 'production'
}

export enum APIErrorCode {
  NO_BURNER_WALLET = 'BURNER_WALLET_NOT_AVAILABLE',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXCHANGE_RATE_EXPIRED = 'EXCHANGE_RATE_SESSION_EXPIRED'
}

export const ButtonStyles = {
  [ButtonType.PRIMARY]: 'zamp-primary-button',
  [ButtonType.SECONDARY]: 'zamp-secondary-button',
  [ButtonType.DISCONNECT]: 'zamp-disconnect-button'
};

// TODO: remove - fetch from BE

export const GENERIC_ERROR_PROPS = {
  buttonLabel: 'Go back',
  header: 'Oops! Something went wrong!',
  description: 'Please try again'
};

export const CANNOT_PROCESS_ERROR_PROPS = {
  buttonLabel: 'Ok, Understood',
  header: 'Payment can’t be processed',
  description:
    'Your payment can’t be processed with the selected wallet address. Please use a different wallet address.'
};

export const INVALID_ACCOUNT = {
  buttonLabel: 'Ok, Understood',
  header: 'Invalid Account!',
  description: 'You seem to have switched your account. Please connect again'
};

export const INVALID_CHAIN_PROPS = {
  buttonLabel: 'Go back',
  header: 'You are on an invalid chain!',
  description: 'Please try again or switch to the correct chain'
};

export const METAMASK_PENDING_REQUEST_PROPS = {
  buttonLabel: 'Understood',
  header: 'Pending metamask request!',
  description: 'Please check your metamask extension and try again'
};

export const NO_BURNER_WALLET = {
  buttonLabel: 'Understood',
  header: 'No burner wallet available right now!',
  description: 'Please try again later'
};

export const WALLET_ICONS = {
  [Wallets.METAMASK]: 'metamask-icon',
  [Wallets.WALLETCONNECT]: 'wallet-connect-icon',
  [Wallets.PHANTOM]: 'phantom-icon',
  [Wallets.BINANCE]: 'binance-icon',
  GENERIC: 'generic-wallet-icon'
};

export const FULL_DASH_ARRAY = 283;

export const GET_PAYMENT_POLLING_COUNT = 60;

export const DEFAULT_PAYMENT_TIME_LIMIT = 300;

export const DEFAULT_PAYMENT_TIME_REMAINING = 0;

export const TIME_UP_REDIRECTION_TIME = 5;

export const SESSION_LOCAL_STORAGE_ID = 'zamp-session-id';

export const SESSION_ENDED_LOCAL_STORAGE_ID = 'zamp-session-end';

export const SDK_REDIRECTION_URL = 'confirm-url';

export enum ZampfiActions {
  SUCCESS = 'success',
  FAILURE = 'failure',
  CANCEL = 'cancel'
}
