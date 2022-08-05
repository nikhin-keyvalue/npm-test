import { StateUpdater } from 'preact/hooks';
import { BottomSheetTypes, ErrorType, ModalTypes, RiskScore, RiskStatus, Wallets, ZampfiPages } from 'constants/common';
import { ChainTypes, Balance, CoinTypes } from './wallet';

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

export type OptionsType = {
  session: string;
  token: string;
  platform: string;
  // TODO: make optional
  onPaymentCompleted: (payload: PaymentStatus) => void;
  onPaymentCancel: () => void;
  onLoaded: () => void;
};

export type HttpOptions = {
  accept?: string;
  contentType?: string;
  errorMessage?: string;
  headers?: any;
  loadingContext?: string;
  method?: string;
  path: string;
  errorLevel?: ErrorLevel;
  token: string;
  platform: string;
};

export type OrderDetails = {
  id: string;
  amount: string;
  currency: string;
  environment: 'test' | 'live';
};

export type UserDetails = {
  id: string;
  name: string;
  logo: string;
};

export type ErrorResponse = {
  code: string;
  message: string;
};

export type CheckoutSessionSetupResponse = {
  data: PaymentInfo;
  error?: ErrorResponse;
};

export type CreatePaymentResponse = {
  data: PostPaymentInfo;
  error?: ErrorResponse;
};

export type CoinsElement = {
  id: string;
  name: string;
  type: string;
  code: CoinTypes;
  network: string;
  symbol: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  logo_url: string;
};

export type GetCoinsResponse = {
  data: Array<CoinsElement>;
};

export type PaymentStatus = {
  status: string;
  message: string;
};

export type ErrorLevel = 'silent' | 'info' | 'warn' | 'error' | 'fatal';

export type WalletListProps = {
  setSelectedWallet: StateUpdater<WalletData>;
  walletList: WalletDetails;
  setAddress: StateUpdater<string | null>;
  selectedChainObject: AvailableNetworks;
  setCurrentChain: StateUpdater<ChainTypes | null>;
  setRemoveWalletListener: (listener: () => void) => void;
  onWalletConnected: (ConnectionInfo: ConnectionInformation, paymentOption?: Wallets) => void;
  setModalOpen: (state: ModalTypes | null) => void;
  rpcUrls: Map<number, string>;
};

export type CoinListProps = {
  handlePageChange: (args: ZampfiPages) => void;
  setSelectedCoinObject: (args: CoinData) => void;
  setSelectedAmount: (args: string) => void;
  onTransactionCompleted: (hash: string, paymentId: string) => Promise<void>;
  currentChain: ChainTypes | null;
  selectedChain: ChainTypes;
  address: string | null;
  amount: string;
  sourceCurrency: string;
  isPaymentStarted: boolean;
  setIsPaymentStarted: StateUpdater<boolean>;
  onCoinSelect: (coin: CoinTypes) => Promise<CreatePaymentResponse | null>;
  convertedAmounts: CoinData[];
  balances: Balance[];
  setModalOpen: (state: ModalTypes | null) => void;
  selectedWallet: WalletData;
  isBottomSheetOpen: BottomSheetTypes | null;
  setBottomSheetOpen: (state: BottomSheetTypes | null) => void;
  setCurrentPage: StateUpdater<ZampfiPages>;
};

export type BinanceScreenProps = {
  coinData: CoinData;
  sourceCurrency: string;
  amount: string;
  createPayment: (coin: CoinTypes) => Promise<CreatePaymentResponse | null>;
  setLoading: StateUpdater<boolean>;
  setCurrentPage: StateUpdater<ZampfiPages>;
  setModalOpen: StateUpdater<ModalTypes | null>;
  setShowBinanceTutorial: StateUpdater<boolean>;
  paymentPoll: (paymentId: string) => Promise<void>;
};

export type BitCoinScreenProps = {
  totalPrice?: string;
  currencyType?: string;
  isLoading: boolean;
  BTCConnectionInfo: ConnectionInformation;
  convertedAmounts: CoinData[] | undefined;
  createPayment: (coin: CoinTypes) => Promise<CreatePaymentResponse | null>;
  paymentPoll: (paymentId: string) => Promise<void>;
  onWalletConnected: (connectionInfo: ConnectionInformation, paymentOption?: Wallets) => Promise<void>;
  setCurrentPage: StateUpdater<ZampfiPages>;
  getQRCode: (paymentId: string) => Promise<BTCQRCodeResponse | null>;
  setModalOpen: StateUpdater<ModalTypes | null>;
  setLoading: StateUpdater<boolean>;
  clearValues: () => void;
  paymentTimeLimit: number;
  maxTimeLimit: number;
  startTimer: boolean;
};

export type PaymentDetailsProps = {
  isVisible?: boolean;
  totalPrice: string;
  exchangeRate: string;
  subTotal: string;
  sourceCurrency: string;
  currencyCode: string;
};

export type Merchant = {
  name: string;
  country_code: string;
  logo: string;
  theme: any;
  status: string;
  payment_time_limit: number;
};

export type PaymentOption = {
  id: string;
  name: string;
  type: string;
};

export type WalletData = {
  id: string;
  logo_url: string;
  name: Wallets;
  type: string;
};

export type WalletDetails = {
  [key in Wallets]: WalletData;
};

export type AvailableNetworks = {
  network_display_name: string;
  network_logo_url: string;
  network_code: string;
  eligible_payment_options: Wallets[] | null;
  network_chain_id: ChainTypes;
  rpc_url: string;
};

export type PaymentOptions = Array<PaymentOption>;

export type MerchantConfig = {
  merchant: Merchant;
  available_networks: AvailableNetworks[];
  payment_options: WalletDetails;
  default_network: string;
};

export type CoinData = {
  amount: string;
  exchange_rate: string;
  currency_code: CoinTypes;
  display_name: string;
  type: string;
  logo_url: string;
  contract_address: string; //TODO: make conditional
  lowest_denom_amount: string;
};

export type PaymentInfo = {
  id: string;
  reference_id: string;
  merchant_id: string;
  status: string; // TODO: change
  source_amount: string;
  source_currency: string;
  source_account: string;
  payment_option_id: string;
  amount: number;
  network_cost: number;
  country_code: string;
  redirect_urls: {
    confirmUrl: string;
    failUrl: string;
  };
  converted_amounts: null | Array<CoinData>;
  exchange_rates_expiry: Date;
  meta: null | string;
  risk_score: RiskScore;
  risk_status: RiskStatus;
  created_at: Date;
  updated_at: Date;
  expires_at: Date;
};

export type PostPaymentInfo = {
  id: string;
  reference_id: string;
  merchant_id: string;
  payment_session_id: string;
  status: string; // TODO: types
  source_amount: string;
  source_currency: string; // TODO: types
  currency_code: CoinTypes;
  network_code: string; // TODO: types
  payment_option_id: string;
  amount: string;
  lowest_denom_amount: string;
  exchange_rate: string;
  source_account: string;
  dest_account: string;
  transaction_hash: string;
  blockchain_transaction_info: string | null;
  network_cost: number;
  expires_at: Date;
  country_code: string;
  meta: string | null;
  created_at: Date;
  updated_at: Date;
};

export type ConnectionInformation = {
  payment_option_id: string;
  source_account?: string;
  network_code: string;
};

export type LoaderTypes = {
  type?: 'default' | 'payment-processing';
};

export type InstallationPopUpProps = {
  // TODO needs tobe updated
  selectedWallet: WalletData;
  handlePaymentCancel: () => void;
};

export type ErrorModalProps = {
  errorType: ErrorType;
  header: string;
  description: string;
  buttonLabel: string;
  handleButtonClick: () => void;
};

export type WalletPopUpProps = {
  isConnected: boolean;
  selectedWallet: WalletData;
  showCancel?: boolean;
  onCancel?: () => void;
  cancelDelay?: number;
};

export type TimeUpModalProps = {
  handlePaymentCancel: () => void;
};

export type DropDownProps = {
  onSelectItem: (args: AvailableNetworks) => void;
  itemsList: AvailableNetworks[];
  setDropDownActive: (state: boolean) => void;
  isDropDownActive: boolean;
  itemInitialValue: AvailableNetworks;
  isBottomSheetOpen: BottomSheetTypes | null;
  setBottomSheetOpen: (state: BottomSheetTypes | null) => void;
};

export type BottomSheetPaymentDetailsProps = {
  isVisible?: boolean;
  totalPrice?: string;
  exchangeRate?: string;
  subTotal?: string;
  sourceCurrency?: string;
  currencyCode?: string;
  coinName?: string;
  coinLogourl?: string;
  handlePayButtonClick: () => void;
  isPayButtonDisabled: boolean;
};

export type NetworkSelectProps = {
  setBottomSheetOpen: (state: BottomSheetTypes | null) => void;
  availableNetwork: AvailableNetworks[];
  setSelectedItem: (state: AvailableNetworks) => void;
  onSelectItem: (args: AvailableNetworks) => void;
  selectedItem: AvailableNetworks;
};

export type BTCQrData = {
  qrcode: string;
  url: string;
};

export type BTCQRCodeResponse = {
  data: BTCQrData;
};
