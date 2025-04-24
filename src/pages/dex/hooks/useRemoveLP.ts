import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { formatNumber } from '@/hooks/useErc20Balance';
import useXWriteContract from '@/hooks/useXWriteContract';
import { getPairTokens } from '@/services/explore';
import { useMutation } from '@tanstack/react-query';
import { formatUnits, parseUnits } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Address } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

const useRemoveLP = () => {
  const params = useParams<{ address: string }>();
  const pairAddress = params.address;

  const { address: userAddress } = useAccount();
  const [removePercent, setRemoveAmount] = useState('');
  const { data, mutate, isPending } = useMutation({
    mutationFn: getPairTokens,
  });
  const { writeContractAsync, isSubmittedLoading } = useXWriteContract({});
  useEffect(() => {
    if (pairAddress) {
      mutate({ pairs: pairAddress });
    }
  }, [pairAddress]);

  const { data: info, isLoading } = useReadContract({
    address: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SWAP_CONTRACT.interface.abi,
    functionName: 'getLpReserve',
    args: [pairAddress || ''],
    query: {
      enabled: !!pairAddress,
    },
  });

  const { data: userLPInfo, isLoading: isUserLoading } = useReadContract({
    address: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SWAP_CONTRACT.interface.abi,
    functionName: 'getUserLpReservesAmount',
    args: [pairAddress!, userAddress!],
    query: {
      enabled: !!pairAddress && !!userAddress,
    },
  });

  const { data: userLpAmount, isLoading: isUser2Loading } = useReadContract({
    address: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SWAP_CONTRACT.interface.abi,
    functionName: 'getUserCoinOrLpAmount',
    args: [pairAddress!, userAddress!],
    query: {
      enabled: !!pairAddress && !!userAddress,
    },
  });

  const pool = data?.items?.[0];

  const tokenA = useMemo(() => {
    if (info && pool) {
      return {
        ...pool?.tokenA,
        amount: formatNumber(
          Number(formatUnits((info as bigint[][])[0][0] || 0n)),
          4
        ),
      };
    }
  }, [pool, info]);

  const tokenB = useMemo(() => {
    if (info && pool) {
      return {
        ...pool?.tokenB,
        amount: formatNumber(
          Number(formatUnits((info as bigint[][])[1][0] || 0n)),
          4
        ),
      };
    }
  }, [pool, info]);

  const availableLPAmount = useMemo(() => {
    if (info) {
      return formatNumber(
        Number(formatUnits((userLpAmount as bigint) || 0n)),
        4
      );
    }
    return 0;
  }, [userLpAmount]);

  const fee = useMemo(() => Number(pool?.fees || 0) / 100, [pool]);

  const apr = useMemo(
    () =>
      (
        ((365 *
          Number(formatUnits(pool?.volume24h || 0n)) *
          (Number(pool?.fees || 0) / 10000)) /
          Number(formatUnits(pool?.tvl || 0n || 1))) *
        100
      ).toFixed(2),
    [pool]
  );

  const tokenAReceiveAmount = useMemo(() => {
    if (userLpAmount && removePercent && userLPInfo) {
      const tokenALPTotal = Number(
        formatUnits((userLPInfo as bigint[][])[1][0]) || 0n
      );
      const LPTotal = Number(formatUnits((userLpAmount as bigint) || 0n));

      const amount = (Number(removePercent) / 100) * LPTotal;

      return formatNumber(amount * (tokenALPTotal / LPTotal), 4);
    }
    return 0;
  }, [removePercent, userLPInfo, userLpAmount]);

  const tokenBReceiveAmount = useMemo(() => {
    if (userLpAmount && removePercent && userLPInfo) {
      const tokenBLPTotal = Number(
        formatUnits((userLPInfo as bigint[][])[1][1]) || 0n
      );
      const LPTotal = Number(formatUnits((userLpAmount as bigint) || 0n));

      const amount = (Number(removePercent) / 100) * LPTotal;

      return formatNumber(amount * (tokenBLPTotal / LPTotal), 4);
    }
    return 0;
  }, [removePercent, userLPInfo, userLpAmount]);

  const shareOfPool = useMemo(() => {
    if (info && userLpAmount) {
      const LPTotal = Number(formatUnits((info as bigint[])[2] || 0n));
      const userTotal = Number(formatUnits((userLpAmount as bigint) || 0n));

      return formatNumber((Number(userTotal) / Number(LPTotal)) * 100, 2);
    }
    return 0;
  }, [info, userLpAmount]);

  const pairToken = pool?.pairToken;

  const removeAmount = useMemo(() => {
    if (userLpAmount && removePercent) {
      const LPTotal = Number(formatUnits((userLpAmount as bigint) || 0n));
      return formatNumber((Number(removePercent) / 100) * LPTotal, 6);
    }
    return 0;
  }, [removePercent, userLpAmount]);

  const loading = isLoading || isPending || isUserLoading || isUser2Loading;

  const remove = async () => {
    if (pairAddress && removePercent && userLpAmount) {
      const { address, abi } = ZERITHIUM_SWAP_CONTRACT.interface;
      const LPTotal = Number(formatUnits((userLpAmount as bigint) || 0n));
      const removeAmount = (Number(removePercent) / 100) * LPTotal;

      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'xLpRedeem2',
        args: [
          pairAddress as Address,
          Number(removePercent) >= 100
            ? (userLpAmount as bigint)
            : parseUnits(String(removeAmount)),
        ],
      });
    }
  };

  return {
    pairAddress,
    isPending,
    pairToken,
    tokenA,
    tokenB,
    fee,
    apr,
    availableLPAmount,
    tokenAReceiveAmount,
    tokenBReceiveAmount,
    shareOfPool,
    setRemoveAmount,
    removePercent,
    removeAmount,
    pool,
    loading,
    remove,
    isSubmittedLoading,
  };
};

export default useRemoveLP;
