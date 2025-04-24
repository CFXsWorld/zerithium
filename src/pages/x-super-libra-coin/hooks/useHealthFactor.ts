import useSLCContract from '@/hooks/useSLCContract.ts';
import { useAccount } from 'wagmi';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { formatUnits, parseUnits } from 'ethers';

const useHealthFactor = () => {
  const contract = useSLCContract();

  const { address } = useAccount();

  const getBorrowHealth = async (amount: string) => {
    if (address && amount) {
      return contract
        .usersHealthFactorEstimate(
          address,
          ZERITHIUM_SWAP_CONTRACT.slc.address,
          parseUnits(amount),
          0
        )
        .then((factor) => formatUnits(factor, 18));
    }
  };
  const getRepayHealth = async (amount: string) => {
    if (address && amount) {
      return contract
        .usersHealthFactorEstimate(
          address,
          ZERITHIUM_SWAP_CONTRACT.slc.address,
          parseUnits(amount),
          1
        )
        .then((factor) => formatUnits(factor, 18));
    }
  };

  return {
    getBorrowHealth,
    getRepayHealth,
  };
};

export default useHealthFactor;
