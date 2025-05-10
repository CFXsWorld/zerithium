import { ReactNode } from 'react';

export interface Token {
  decimals?: number;
  symbol?: string;
  name?: string;
  price?: number;
  address: string;
  icon?: string | ReactNode;
  amount?: number;
  chainId?: number;
  tvl?: string;
  volume24h?: string;
  volume1w?: string;
  price24ago?: string;
}

export interface SwapRoute {
  route: Token[];
}
