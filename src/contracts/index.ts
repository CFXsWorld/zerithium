import SwapInterfaceABI from './abi/SwapInterface.json';
import SLCInterfaceABI from './abi/SLCInterface.json';
import iSlcOracleABI from './abi/iSlcOracle.json';
import Multicallespacetestnet from './abi/Multicallespacetestnet.json';
import LendingInterfaceABI from './abi/LendingInterface.json';
import { Abi, Address, erc20Abi, isAddress } from 'viem';
import { getAddress, InterfaceAbi } from 'ethers';
import { Token } from '@/types/swap.ts';

export const ZERITHIUM_LENDING_CONTRACT: Record<
  'interface',
  { address: Address; abi: InterfaceAbi | Abi | any }
> = {
  interface: {
    address: '0xb4ff8cBc8DECDD89cbDC5B9EB6C521e0cA063dAF',
    abi: LendingInterfaceABI,
  },
};

export const ZERITHIUM_SWAP_CONTRACT: Record<
  'interface' | 'slc' | 'usdt' | 'usdc',
  { address: Address; abi: InterfaceAbi | Abi | any }
> = {
  interface: {
    address: '0xe63a6756A22049B2aD6e21E3ba2d79E02792ECcB',
    abi: SwapInterfaceABI,
  },
  // main
  slc: {
    address: '0xF65050e2AC003569a4b18E612B86CC833afE5960',
    abi: erc20Abi,
  },
  usdt: {
    address: '0x3ec8a8705be1d5ca90066b37ba62c4183b024ebf',
    abi: erc20Abi,
  },
  // main
  usdc: {
    address: '0x6963efed0ab40f6c3d7bda44a05dcf1437c44372',
    abi: erc20Abi,
  },
};

export const ZERITHIUM_SLC_CONTRACT: Record<
  'interface' | 'oracle' | 'mutilCall',
  { address: Address; abi: InterfaceAbi | Abi | any }
> = {
  // // testnet
  // interface: {
  //   address: '0xcFB7069024B006F3c1d9C0C67a6aB0c4740f8bB7',
  //   abi: SLCInterfaceABI,
  // },
  // main
  interface: {
    address: '0xC2F98875B4e301B2bdb66B9c64669EaF9873fFd7',
    abi: SLCInterfaceABI,
  },
  oracle: {
    address: '0xFf87E6e1148dC65E534e0f2AfbE5F4f0c2cbF6E5',
    abi: iSlcOracleABI,
  },
  mutilCall: {
    address: '0xae5D6ff83D7B7DAfce396Df63189A6eC03b306F5',
    abi: Multicallespacetestnet,
  },
};

export const NATIVE_ERC20_TOKEN: Record<string, Token> = {
  16600: {
    address: '0x26efCdC7adA14EcAf755557cc62f4FD7757586CC',
    symbol: 'A0GI',
    name: 'A0GI',
    decimals: 18,
  },
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const isSLCToken = (address: string) => {
  return (
    isAddress(address) &&
    getAddress(address).toLowerCase() ===
      getAddress(ZERITHIUM_SWAP_CONTRACT.slc.address).toLowerCase()
  );
};

export const SLCToken: Token = {
  address: ZERITHIUM_SWAP_CONTRACT.slc.address,
  symbol: 'xUSD',
  decimals: 18,
  chainId: 16600,
  // chainId: 71,
  name: 'X Libra USD',
  icon: 'https://espacemainnetapi.zerithium.io/coin/xUSD.png',
};

export const USDTToken: Token = {
  address: ZERITHIUM_SWAP_CONTRACT.usdt.address,
  name: 'Tether USD',
  symbol: 'USDT',
  icon: 'https://espacemainnetapi.zerithium.io/coin/1728405426994.png',
  decimals: 18,
};

export const USDCToken: Token = {
  address: ZERITHIUM_SWAP_CONTRACT.usdc.address,
  name: 'USD Coin',
  symbol: 'USDC',
  icon: 'https://espacemainnetapi.zerithium.io/coin/1728402879785.png',
  decimals: 18,
};
