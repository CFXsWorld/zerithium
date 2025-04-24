import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'ethers';
import useLendingContract from '@/hooks/useLendingContract.ts';
import { LendingAsset } from '@/types/Lending.ts';
import { formatNumber } from '@/hooks/useErc20Balance';
import { EstimatedHealthFactor } from '@/types/Lending';

const useHealthFactor = (asset: LendingAsset) => {
  const contract = useLendingContract();

  const { address } = useAccount();

  const getEatRate = async (
    amount: string,
    mode: number
  ): Promise<EstimatedHealthFactor | undefined> => {
    if (address) {
      return contract
        .usersHealthFactorAndInterestEstimate(
          address,
          asset.token.address,
          parseUnits(String(formatNumber(Number(amount || '0'), 6))),
          mode
        )
        .then((factor) => {
          return {
            healthFactor: formatUnits(factor[0], 18),
            supplyInterest:
              formatNumber(Number(String(factor[1][0])) / 100, 2) + '%',
            borrowInterest:
              formatNumber(Number(String(factor[1][1])) / 100, 2) + '%',
          };
        });
    }
  };

  const getDepositHealth = async (amount: string) => {
    return getEatRate(amount, 0);
  };

  const getWithdrawHealth = async (amount: string) => {
    return getEatRate(amount, 1);
  };

  const getLendingHealth = async (amount: string) => {
    return getEatRate(amount, 2);
  };
  const getRepayHealth = async (amount: string) => {
    return getEatRate(amount, 3);
  };

  return {
    getDepositHealth,
    getRepayHealth,
    getLendingHealth,
    getWithdrawHealth,
  };
};

export default useHealthFactor;
