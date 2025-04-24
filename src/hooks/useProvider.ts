import { JsonRpcProvider } from 'ethers';
import { CHAINS } from '@/contracts/chains.tsx';
// import useEnv from './useEnv';

// TODO CHANGE CHAIN
const useProvider = () => {
  // const rpc = CHAINS.eSpaceTest.rpc[0];

  const rpc = CHAINS.zeroGTest.rpc[0];

  return new JsonRpcProvider(rpc);
};

export default useProvider;
