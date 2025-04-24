import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { ZERITHIUM_LENDING_CONTRACT } from '@/contracts';
import { Address, erc20Abi } from 'viem';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { useEffect, useMemo, useState } from 'react';
import { isNumeric } from '@/utils/isNumeric.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import useTokenPrice from '@/hooks/useTokenPrice.ts';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits, parseUnits } from 'ethers';
import { EstimatedHealthFactor, LendingAsset } from '@/types/Lending.ts';
import useHealthFactor from '@/pages/lending/hooks/useHealthFactor.ts';

const useWithdraw = ({
  asset,
  refresh,
}: {
  asset: LendingAsset;
  refresh: () => void;
}) => {
  const inputToken = asset.token;
  const [payAmount, setPayAmount] = useState<string>('');
  const [estimatedHealthFactor, setEstimatedHealthFactor] =
    useState<EstimatedHealthFactor>();
  const { getBalance } = useErc20Balance();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const { isNativeToken, getRealAddress } = useNativeToken();
  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
    address: inputToken?.address,
  });
  const { address } = useAccount();

  const [isWithdrawAll, setWithdrawAll] = useState(false);

  const { getWithdrawHealth } = useHealthFactor(asset);

  const { writeContractAsync, isSubmittedLoading, loading } = useXWriteContract(
    {
      onWriteSuccess: refresh,
    }
  );

  const { data: health } = useReadContract({
    address: ZERITHIUM_LENDING_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_LENDING_CONTRACT.interface.abi,
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

  useEffect(() => {
    if (address && payAmount) {
      getWithdrawHealth(payAmount).then(setEstimatedHealthFactor);
    }
  }, [address, payAmount]);

  const withdrawNormal = async () => {
    if (decimals) {
      const amountIn = parseUnits(payAmount, decimals);

      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      if (isWithdrawAll) {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'withdrawDepositMax',
          args: [inputToken?.address],
        });
      } else {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'withdrawDeposit',
          args: [inputToken?.address, amountIn],
        });
      }
    }
  };

  const withdrawCFX = async () => {
    if (decimals) {
      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      const amountIn = parseUnits(payAmount, decimals);
      if (isWithdrawAll) {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'withdrawDepositMax2',
          args: [inputToken?.address],
        });
      } else {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'withdrawDeposit2',
          args: [inputToken?.address, amountIn],
        });
      }
    }
  };

  const withdraw = () => {
    if (isNativeToken(inputToken!)) {
      withdrawCFX();
    } else {
      withdrawNormal();
    }
  };

  const isInsufficient = useMemo(() => {
    return (
      isNumeric(payAmount) && Number(payAmount) > Number(asset.depositAmount)
    );
  }, [payAmount, asset?.depositAmount]);

  const userHealthFactor = useMemo(() => {
    if (health) {
      return Number(formatUnits(health.toString(), 18));
    }
    return 0;
  }, [health]);

  const remainingProvided = useMemo(
    () =>
      payAmount && asset?.depositAmount
        ? formatNumber(Number(asset?.depositAmount) - Number(payAmount), 8)
        : asset?.depositAmount || 0,
    [payAmount, asset?.depositAmount]
  );

  const onWithdrawAllChange = async (checked: boolean) => {
    setWithdrawAll(checked);
    if (checked) {
      setPayAmount(String(asset?.depositAmount));
    } else {
      setPayAmount('');
    }
  };

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
    isWithdrawAll,
    onWithdrawAllChange,
  };
};

export default useWithdraw;
