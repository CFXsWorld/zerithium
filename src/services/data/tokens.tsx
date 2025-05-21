import { Token } from '@/types/swap';
import { BTCIcon, ETHIcon, USDTIcon } from '@/components/icons/tokens';

export const tokens: Token[] = [
  {
    address: '0x26efCdC7adA14EcAf755557cc62f4FD7757586CC',
    symbol: 'A0GI',
    name: 'A0GI',
    decimals: 18,
  },
  {
    address: '0x3ec8a8705be1d5ca90066b37ba62c4183b024ebf',
    symbol: 'USDT',
    name: 'tUSDT',
    decimals: 6,
    icon: <USDTIcon />,
  },
  {
    address: '0x36f6414ff1df609214ddaba71c84f18bcf00f67d',
    symbol: 'BTC',
    name: 'tBTC',
    decimals: 18,
    icon: <BTCIcon />,
  },
  {
    address: '0x0fe9b43625fa7edd663adcec0728dd635e4abf7c',
    symbol: 'ETH',
    name: 'tETH',
    decimals: 18,
    icon: <ETHIcon />,
  },
  {
    address: '0xb4c1Db4d7Da27243C61361036c022b16b9CE16fa',
    symbol: 'wOG',
    name: 'tOG',
    decimals: 18,
  },
];
