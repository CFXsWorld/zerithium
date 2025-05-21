import { ChainType } from '@/types/chain.ts';
import { ZeroGIcon } from '@/components/icons';

type ChainName = 'zeroGTest';

export const CHAINS: Record<ChainName, ChainType> = {
  zeroGTest: {
    chainId: 16601,
    name: '0G Newton Testnet',
    icon: <ZeroGIcon />,
    rpc: ['https://evmrpc-testnet.0g.ai/'],
  },
};
