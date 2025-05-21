import { useAccount, useReadContract } from 'wagmi';
import {
  ZERITHIUM_LENDING_CONTRACT,
  ZERITHIUM_SLC_CONTRACT,
} from '@/contracts';
import { Address } from 'viem';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getLendingAssets } from '@/services/lending.ts';
import useMulticall, { ContractCall } from '@/hooks/useMulticall.ts';
import { formatUnits } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { LendingAsset } from '@/types/Lending.ts';
import { Token } from '@/types/swap.ts';
import { sumBy } from 'lodash';

const useMarket = () => {
  const { getRealAddress } = useNativeToken();
  const { address } = useAccount();
  const { multiCall } = useMulticall();
  const [lendingAssets, setLendingAssets] = useState<LendingAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    mutate: getAssets,
    data,
    isPending,
  } = useMutation({
    mutationFn: getLendingAssets,
  });

  useEffect(() => {
    getAssets();
  }, []);

  const { data: userAssets, isLoading } = useReadContract({
    address: ZERITHIUM_LENDING_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_LENDING_CONTRACT.interface.abi,
    functionName: 'generalParametersOfAllAssets',
    args: [],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (userAssets && data?.items?.length && address) {
      setLoading(true);
      const tokens = (userAssets as string[][])[0];
      const depositAmounts = (userAssets as bigint[][])[1];
      const lendingAmounts = (userAssets as bigint[][])[2];

      const depositInterests = (userAssets as bigint[][])[3];

      const lendingInterests = (userAssets as bigint[][])[4];

      const totalAvailableAmounts = (userAssets as bigint[][])[5];

      const calls: ContractCall[] = tokens.map((tokenAddress) => ({
        name: 'getPrice',
        abi: ZERITHIUM_SLC_CONTRACT.oracle.abi,
        address: ZERITHIUM_SLC_CONTRACT.oracle.address as Address,
        values: [getRealAddress({ address: tokenAddress } as Token)],
      }));

      multiCall(calls)
        .then(async (allUnitPrice) => {
          const newData = [];
          for (let index = 0; index < tokens.length; index++) {
            const tokenAddress = tokens[index];
            const asset = (data.items || []).find(
              (n) =>
                n.token.address?.toLowerCase() === tokenAddress?.toLowerCase()
            );
            if (asset) {
              const unitPrice = Number(
                formatUnits(allUnitPrice.returnData[index])
              );
              const depositAmount = Number(formatUnits(depositAmounts[index]));
              const lendingAmount = Number(formatUnits(lendingAmounts[index]));
              const depositTotalPrice = formatNumber(
                depositAmount * unitPrice,
                6
              );
              const lendingTotalPrice = formatNumber(
                lendingAmount * unitPrice,
                6
              );
              const lendingInterest =
                Number(lendingInterests[index].toString()) / 100;
              const depositInterest =
                Number(depositInterests[index].toString()) / 100;
              const availableAmount = Number(
                formatUnits(totalAvailableAmounts[index])
              );
              const availableTotalPrice = formatNumber(
                availableAmount * unitPrice,
                6
              );
              newData.push({
                ...asset,
                depositAmount,
                depositInterest,
                lendingAmount,
                lendingInterest,
                depositTotalPrice,
                lendingTotalPrice,
                availableTotalPrice,
                availableAmount,
              });
            }
          }
          setLendingAssets(newData);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userAssets, address, data]);

  const totalMarketSize = useMemo(() => {
    return sumBy(
      lendingAssets,
      (asset) => (asset.lendingTotalPrice || 0) + (asset.depositTotalPrice || 0)
    );
  }, [lendingAssets]);

  const totalLendingSize = useMemo(() => {
    return sumBy(lendingAssets, (asset) => asset.lendingTotalPrice || 0);
  }, [lendingAssets]);

  const totalDepositSize = useMemo(() => {
    return sumBy(lendingAssets, (asset) => asset.depositTotalPrice || 0);
  }, [lendingAssets]);

  return {
    loading: loading || isLoading || isPending,
    lendingAssets,
    totalLendingSize,
    totalDepositSize,
    totalMarketSize,
    setLendingAssets,
  };
};

export default useMarket;
