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
import { formatNumber } from '@/utils';

const useRepay = ({
  asset,
  refresh,
}: {
  asset: LendingAsset;
  refresh: () => void;
}) => {
  const { getBalance } = useErc20Balance();
  const [availableAmount, setAvailableAmount] = useState(0);
  const inputToken = asset.token;
  const [payAmount, setPayAmount] = useState<string>('');
  const [healthFactor, setHealthFactor] = useState<EstimatedHealthFactor>();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const { isNativeToken } = useNativeToken();
  const [isRepayAll, setRepayAll] = useState(false);

  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
    address: inputToken?.address,
  });

  const { getRepayHealth } = useHealthFactor(asset);

  useEffect(() => {
    if (payAmount) {
      getRepayHealth(payAmount).then(setHealthFactor);
    }
  }, [payAmount]);

  useEffect(() => {
    if (inputToken?.address) {
      getBalance(inputToken.address).then((amount) => {
        setInputOwnerAmount(amount);
        setAvailableAmount(
          Math.min(Number(asset.lendingAmount || 0), Number(amount || 0))
        );
      });
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

  const repayNormal = async () => {
    if (decimals) {
      const amountIn = parseUnits(payAmount, decimals);
      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      if (isRepayAll) {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'repayLoanMax',
          args: [inputToken?.address],
        });
      } else {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'repayLoan',
          args: [inputToken?.address, amountIn],
        });
      }
    }
  };

  const repayCFX = async () => {
    if (decimals) {
      const { address, abi } = ZERITHIUM_LENDING_CONTRACT.interface;
      const amountIn = parseUnits(payAmount, decimals);
      if (isRepayAll) {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'repayLoanMax2',
          args: [inputToken?.address],
          value: parseUnits(
            String(formatNumber(Number(availableAmount) * 1.001, 4)),
            decimals
          ),
        });
      } else {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'repayLoan2',
          value: parseUnits(payAmount, decimals),
          args: [inputToken?.address, amountIn],
        });
      }
    }
  };

  const onConfirm = () => {
    if (isNativeToken(inputToken!)) {
      repayCFX();
    } else {
      repayNormal();
    }
  };

  const onRepayAllChange = async (checked: boolean) => {
    setRepayAll(checked);
    console.log(availableAmount, 'availableAmount');
    if (checked) {
      setPayAmount(String(availableAmount));
    } else {
      setPayAmount('');
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
    onRepayAllChange,
    isRepayAll,
  };
};

export default useRepay;
