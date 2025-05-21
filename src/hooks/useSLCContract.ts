import useProvider from '@/hooks/useProvider.ts';
import { Contract } from 'ethers';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { JsonRpcProvider } from 'ethers';
const useSLCContract = () => {
  const { rpc } = useProvider();
  const provider = new JsonRpcProvider(rpc);

  const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;

  return new Contract(address, abi, provider);
};

export default useSLCContract;
