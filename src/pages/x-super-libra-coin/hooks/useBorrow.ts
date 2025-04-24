import { useAccount, useReadContract } from 'wagmi';
import { Address } from 'viem';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { useMemo, useState } from 'react';
import { formatUnits } from 'ethers';

const useBorrow = () => {
  const [sentinel, random] = useState(0);
  const { address } = useAccount();
  const {
    data: overview,
    isLoading: isOverviewLoading,
    refetch: refresh1,
  } = useReadContract({
    address: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SLC_CONTRACT.interface.abi,
    functionName: 'licensedAssetOverview',
  });
  const {
    data: health,
    isLoading: isHealthLoading,
    refetch: refresh2,
  } = useReadContract({
    address: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SLC_CONTRACT.interface.abi,
    functionName: 'viewUsersHealthFactor',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  const refresh = () => {
    random(Math.random());
    refresh1();
    refresh2();
  };

  const tvlAmount = useMemo(() => {
    if (overview) {
      const amount = (overview as bigint[])[0];
      return Number(formatUnits(amount, 18));
    }
    return 0;
  }, [overview]);

  const totalSupply = useMemo(() => {
    if (overview) {
      const amount = (overview as bigint[])[1];
      return Number(formatUnits(amount, 18));
    }
    return 0;
  }, [overview]);

  const unitPrice = useMemo(() => {
    if (overview) {
      const amount = (overview as bigint[])[2];
      return Number(formatUnits(amount, 18));
    }
    return 0;
  }, [overview]);

  return {
    tvlAmount,
    totalSupply,
    unitPrice,
    health,
    isHealthLoading,
    isOverviewLoading,
    refresh,
    sentinel,
  };
};

export default useBorrow;
