import { useEffect, useMemo, useState } from 'react';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import { ZERITHIUM_LENDING_CONTRACT } from '@/contracts';
import { isNumeric } from '@/utils/isNumeric.ts';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import useTokenPrice from '@/hooks/useTokenPrice.ts';
import { parseUnits } from 'ethers';
import { EstimatedHealthFactor, LendingAsset } from '@/types/Lending.ts';
import useHealthFactor from '@/pages/lending/hooks/useHealthFactor.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';

const useLending = ({
  asset,
  refresh,
}: {
  asset: LendingAsset;
  refresh: () => void;
}) => {
  const { getBalance } = useErc20Balance();
  const inputToken = asset.token;
  const availableAmount = asset.availableAmount;
  const [payAmount, setPayAmount] = useState<string>('');
  const [healthFactor, setHealthFactor] = useState<EstimatedHealthFactor>();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const { isNativeToken } = useNativeToken();
  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
    address: inputToken?.address,
  });

  const { getLendingHealth } = useHealthFactor(asset);

  useEffect(() => {
    if (payAmount) {
      getLendingHealth(payAmount).then(setHealthFactor);
    }
  }, [payAmount]);

  useEffect(() => {
    if (inputToken?.address) {
      getBalance(inputToken.address).then(setInputOwnerAmount);
    }
  }, [inputToken]);

  const isReady = useMemo(() => {
    return !!(isNumeric(payAmount) && inputToken?.address);
  }, [inputToken, payAmount]);

  const isInsufficient = useMemo(() => {
    return isNumeric(payAmount) && Number(payAmount) > Number(availableAmount);
  }, [payAmount]);

  const { writeContractAsync, isSubmittedLoading, loading } = useXWriteContract(
    {
      onWriteSuccess: refresh,
    }
  );
  const { data: decimals } = useReadContract({
    address: inputToken?.address as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const lendNormal = async () => {
    if (decimals) {
      const amountIn = parseUnits(
        String(formatNumber(Number(payAmount || 0), 4))
      );

      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'lendAsset',
        args: [inputToken?.address, amountIn],
      });
    }
  };

  const lendCFX = async () => {
    if (decimals) {
      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      const amountIn = parseUnits(
        String(formatNumber(Number(payAmount || 0), 4))
      );
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'lendAsset2',
        args: [inputToken?.address, amountIn],
      });
    }
  };

  const onConfirm = () => {
    if (isNativeToken(inputToken!)) {
      lendCFX();
    } else {
      lendNormal();
    }
  };

  return {
    inputToken,
    payAmount,
    setPayAmount,
    inputOwnerAmount,
    inputTokenTotalPrice,
    isInsufficient,
    isReady,
    isSubmittedLoading,
    loading,
    onConfirm,
    healthFactor,
    availableAmount,
  };
};

export default useLending;
