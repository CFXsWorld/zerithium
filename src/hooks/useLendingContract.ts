import useProvider from '@/hooks/useProvider.ts';
import { Contract } from 'ethers';
import { ZERITHIUM_LENDING_CONTRACT } from '@/contracts';
import { JsonRpcProvider } from 'ethers';

const useLendingContract = () => {
  const { rpc } = useProvider();
  const provider = new JsonRpcProvider(rpc);

  const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;

  return new Contract(address, abi, provider);
};

export default useLendingContract;
