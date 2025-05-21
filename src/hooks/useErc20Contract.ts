import useProvider from '@/hooks/useProvider.ts';
import { Contract } from 'ethers';
import { erc20Abi } from 'viem';
import { JsonRpcProvider } from 'ethers';
const useErc20Contract = (address: string) => {
  const { rpc } = useProvider();
  const provider = new JsonRpcProvider(rpc);

  return new Contract(address, erc20Abi, provider);
};

export default useErc20Contract;
