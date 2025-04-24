import { useCallback, useMemo } from 'react';

import { LendingAsset } from '@/types/Lending';

const useLendingRate = ({
  mode,
  asset,
}: {
  mode: number;
  asset?: LendingAsset;
}) => {
  const assetsBaseInfo = useCallback(() => {
    if (!asset)
      return {
        maximumLTV: 0,
        bestLendingRatio: 0,
        lendingModeNum: 0,
        bestDepositInterestRate: 0,
      };
    return {
      maximumLTV: Number(asset?.max_ltv),
      bestLendingRatio: Number(asset?.best_lending_ratio),
      lendingModeNum: Number(asset?.lending_mode_num),
      bestDepositInterestRate: Number(asset?.best_deposit_interest_rate),
    };
  }, [asset, mode]);

  const depositInterestRate = (lendingRatio: number) => {
    const { bestLendingRatio, bestDepositInterestRate } = assetsBaseInfo();
    let _rate = 0;
    if (lendingRatio <= bestLendingRatio + 500) {
      _rate =
        (((bestDepositInterestRate * lendingRatio) / bestLendingRatio) *
          lendingRatio) /
        bestLendingRatio;
    } else if (lendingRatio <= 9500) {
      _rate =
        (((((bestDepositInterestRate * lendingRatio) / bestLendingRatio) *
          lendingRatio) /
          bestLendingRatio) *
          (lendingRatio - bestLendingRatio)) /
        500;
    } else if (lendingRatio <= 10000) {
      _rate =
        (((((((bestDepositInterestRate * lendingRatio) / bestLendingRatio) *
          lendingRatio) /
          bestLendingRatio) *
          (lendingRatio - bestLendingRatio)) /
          500) *
          (lendingRatio - 9400)) /
        100;
    }
    return _rate;
  };
  const lendingInterestRate = (lendingRatio: number) => {
    const { bestLendingRatio, bestDepositInterestRate, maximumLTV } =
      assetsBaseInfo();
    let _rate = 0;
    if (lendingRatio <= bestLendingRatio + 500) {
      _rate =
        (((((bestDepositInterestRate * lendingRatio) / bestLendingRatio) *
          10500) /
          bestLendingRatio) *
          10000) /
        maximumLTV;
    } else if (lendingRatio <= 9500) {
      _rate =
        (((((((((bestDepositInterestRate * lendingRatio) / bestLendingRatio) *
          10500) /
          bestLendingRatio) *
          10000) /
          maximumLTV) *
          (lendingRatio - bestLendingRatio)) /
          500) *
          lendingRatio) /
        (bestLendingRatio + 500);
    } else if (lendingRatio <= 10000) {
      _rate =
        (((((((((((bestDepositInterestRate * lendingRatio) / bestLendingRatio) *
          10500) /
          bestLendingRatio) *
          10000) /
          maximumLTV) *
          (lendingRatio - bestLendingRatio)) /
          500) *
          lendingRatio) /
          (bestLendingRatio + 500)) *
          (lendingRatio - 9400) *
          (lendingRatio - 9400)) /
        10000;
    }
    return _rate;
  };

  const depositInterestRates = useMemo(() => {
    if (!asset) return [];
    return [...new Array(99)].map(
      (_, index) => depositInterestRate((index + 1) * 100) / 100
    );
  }, [asset]);
  const lendingInterestRates = useMemo(() => {
    if (!asset) return [];
    return [...new Array(99)].map(
      (_, index) => lendingInterestRate((index + 1) * 100) / 100
    );
  }, [asset]);

  return {
    depositInterestRates,
    lendingInterestRates,
  };
};

export default useLendingRate;
