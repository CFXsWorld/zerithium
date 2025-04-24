import { useEffect, useMemo, useState } from 'react';
import useErc20Balance from '@/hooks/useErc20Balance.ts';
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

const useDeposit = ({
  asset,
  refresh,
}: {
  refresh: () => void;
  asset: LendingAsset;
}) => {
  const { getBalance } = useErc20Balance();
  const inputToken = asset.token;
  const [payAmount, setPayAmount] = useState<string>('');
  const [healthFactor, setHealthFactor] = useState<EstimatedHealthFactor>();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);

  const availableAmount = asset.erc20Balance;

  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
    address: inputToken?.address,
  });
  const { isNativeToken } = useNativeToken();
  const { getDepositHealth } = useHealthFactor(asset);

  useEffect(() => {
    if (payAmount) {
      getDepositHealth(payAmount).then(setHealthFactor);
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

  const depositNormal = async () => {
    if (decimals) {
      const amountIn = parseUnits(payAmount, decimals);

      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'assetsDeposit',
        args: [inputToken?.address as Address, amountIn],
      });
    }
  };

  const depositCFX = async () => {
    if (decimals) {
      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      const amountIn = parseUnits(payAmount, decimals);
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'assetsDeposit2',
        args: [inputToken?.address as Address, amountIn],
        value: parseUnits(payAmount, decimals),
      });
    }
  };
  const onConfirm = () => {
    if (isNativeToken(inputToken!)) {
      depositCFX();
    } else {
      depositNormal();
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

export default useDeposit;
