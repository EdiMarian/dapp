interface NetworkType {
  id: 'devnet' | 'testnet' | 'mainnet';
  name: string;
  egldLabel: string;
  walletAddress: string;
  gatewayAddress: string;
  explorerAddress: string;
  apiAddress: string;
}

export const minDust = '5000000000000000';
export const backend = 'http://localhost:4000';
export const tokenName = 'ESTAR';
export const reciveAddress = 'erd1q07w9xm8avd7kwj3cgn3xrnhzg5da7e3vg7dv6gs3npyql0jpq9ss35a20';
export const version = 'V. Alpha0.1.04';
export const dAppName = 'Estar';
export const decimals = 2;
export const denomination = 18;
export const genesisTokenSupply = 20000000;
export const feesInEpoch = 0;
export const protocolSustainabilityRewards = 0.1;
export const yearSettings = [
  { year: 1, maximumInflation: 0.1084513 },
  { year: 2, maximumInflation: 0.09703538 },
  { year: 3, maximumInflation: 0.08561945 },
  { year: 4, maximumInflation: 0.07420352 },
  { year: 5, maximumInflation: 0.0627876 },
  { year: 6, maximumInflation: 0.05137167 },
  { year: 7, maximumInflation: 0.03995574 },
  { year: 8, maximumInflation: 0.02853982 },
  { year: 9, maximumInflation: 0.01712389 },
  { year: 10, maximumInflation: 0.00570796 },
  { year: 11, maximumInflation: 0.0 }
];
export const walletConnectBridge = 'https://bridge.walletconnect.org';
export const walletConnectDeepLink =
  'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/';

export const network: NetworkType = {
  id: 'mainnet',
  name: 'Mainnet',
  egldLabel: 'EGLD',
  walletAddress: 'https://wallet.elrond.com/dapp/init',
  apiAddress: 'https://api.elrond.com',
  gatewayAddress: 'https://gateway.elrond.com',
  explorerAddress: 'https://explorer.elrond.com'
};
