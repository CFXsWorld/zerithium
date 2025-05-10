import { Token } from './types/swap';
import { BTCIcon, ETHIcon } from './components/icons/tokens';

export const tokens: Token[] = [
  {
    address: '0x7E2E43D6c640d79A927EC088568aE67a00F026dd',
    symbol: 'USDT',
    name: 'tUSDT',
    decimals: 6,
  },
  {
    address: '0x52e259C1dA64968A0D529C0EeC9bbB13b2861e79',
    symbol: 'USDC',
    name: 'tUSDC',
    decimals: 6,
  },
  {
    address: '0x0cb82280F367a932279027204563Da9F9A9E82B7',
    symbol: 'BTC',
    name: 'tBTC',
    decimals: 18,
    icon: <BTCIcon />,
  },
  {
    address: '0xc467ee43d401e3654129Fdb70FD238629C9e2034',
    symbol: 'ETH',
    name: 'tETH',
    decimals: 18,
    icon: <ETHIcon />,
  },
  {
    address: '0x69117e986C665a25Fa312Db58809bD7d0da1922e',
    symbol: 'wOG',
    name: 'tOG',
    decimals: 18,
  },
];
