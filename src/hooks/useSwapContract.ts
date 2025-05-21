import useProvider from '@/hooks/useProvider.ts';
import { Contract } from 'ethers';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { JsonRpcProvider } from 'ethers';
const useSwapContract = () => {
  const { rpc } = useProvider();
  const provider = new JsonRpcProvider(rpc);

  const { address, abi } = ZERITHIUM_SWAP_CONTRACT.interface;

  return new Contract(address, abi, provider);
};

export default useSwapContract;
