import useProvider from '@/hooks/useProvider.ts';
import { Contract } from 'ethers';
import { ZERITHIUM_LENDING_CONTRACT } from '@/contracts';

const useLendingContract = () => {
  const provider = useProvider();

  const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;

  return new Contract(address, abi, provider);
};

export default useLendingContract;
