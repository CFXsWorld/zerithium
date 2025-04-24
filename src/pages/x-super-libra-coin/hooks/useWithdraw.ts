import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { Address, erc20Abi } from 'viem';
import { SLCAsset } from '@/types/slc.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { useEffect, useMemo, useState } from 'react';
import { isNumeric } from '@/utils/isNumeric.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import useTokenPrice from '@/hooks/useTokenPrice.ts';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits, parseUnits } from 'ethers';
import useSLCContract from '@/hooks/useSLCContract.ts';

const useWithdraw = ({
  token,
  refresh,
}: {
  token?: SLCAsset;
  refresh: () => void;
}) => {
  const inputToken = token;
  const [payAmount, setPayAmount] = useState<string>('');
  const [estimatedHealthFactor, setEstimatedHealthFactor] = useState<number>(0);
  const { getBalance } = useErc20Balance();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const { isNativeToken, getRealAddress } = useNativeToken();
  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
    address: token?.address,
  });
  const { address } = useAccount();

  const contract = useSLCContract();

  const { writeContractAsync, isSubmittedLoading, loading } = useXWriteContract(
    {
      onWriteSuccess: refresh,
    }
  );

  const { data: health } = useReadContract({
    address: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SLC_CONTRACT.interface.abi,
    functionName: 'viewUsersHealthFactor',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  const { data: decimals } = useReadContract({
    address: getRealAddress(inputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!inputToken,
    },
  });

  useEffect(() => {
    if (inputToken?.address) {
      getBalance(inputToken.address).then(setInputOwnerAmount);
    }
  }, [inputToken]);

  const estimateHealth = async (): Promise<number> => {
    if (address && payAmount) {
      return contract
        .usersHealthFactorEstimate(
          address,
          getRealAddress(inputToken!),
          parseUnits(payAmount),
          1
        )
        .then((factor) => Number(formatUnits(factor, 18)));
    }
    return 0;
  };

  useEffect(() => {
    if (address && payAmount) {
      estimateHealth().then(setEstimatedHealthFactor);
    }
  }, [address, payAmount]);

  const withdrawNormal = async () => {
    if (decimals) {
      const amountIn = parseUnits(payAmount, decimals);

      const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'redeemPledgedAssets',
        args: [inputToken?.address as Address, amountIn],
      });
    }
  };

  const withdrawCFX = async () => {
    if (decimals) {
      const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;
      const amountIn = parseUnits(payAmount, decimals);
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'redeemCFX',
        args: [amountIn],
      });
    }
  };

  const withdraw = () => {
    if (isNativeToken(token!)) {
      withdrawCFX();
    } else {
      withdrawNormal();
    }
  };

  const isInsufficient = useMemo(() => {
    return (
      isNumeric(payAmount) && Number(payAmount) > Number(inputToken?.provided)
    );
  }, [payAmount, inputToken?.provided]);

  const userHealthFactor = useMemo(() => {
    if (health) {
      const amount = (health as bigint[])[0];
      return Number(formatUnits(amount, 18));
    }
    return 0;
  }, [health]);

  const remainingProvided = useMemo(
    () =>
      payAmount && inputToken?.provided
        ? formatNumber(Number(inputToken?.provided) - Number(payAmount), 8)
        : inputToken?.provided || 0,
    [payAmount, inputToken?.provided]
  );

  return {
    withdraw,
    inputToken,
    payAmount,
    setPayAmount,
    isInsufficient,
    inputOwnerAmount,
    isSubmittedLoading,
    loading,
    inputTokenTotalPrice,
    userHealthFactor,
    estimatedHealthFactor,
    remainingProvided,
  };
};

export default useWithdraw;
