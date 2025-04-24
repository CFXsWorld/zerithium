import { useEffect, useMemo, useState } from 'react';
import { Token } from '@/types/swap.ts';
import useErc20Balance from '@/hooks/useErc20Balance.ts';
import { SLCToken, ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { isNumeric } from '@/utils/isNumeric.ts';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import useTokenPrice from '@/hooks/useTokenPrice.ts';
import useHealthFactor from '@/pages/x-super-libra-coin/hooks/useHealthFactor.ts';
import { parseUnits } from 'ethers';

const useRepaySLC = ({
  availableAmount = 0,
  refresh,
}: {
  availableAmount: number;
  refresh: () => void;
}) => {
  const { getBalance } = useErc20Balance();
  const [inputToken] = useState<Token | undefined>(SLCToken);
  const [payAmount, setPayAmount] = useState<string>('');
  const [healthFactor, setHealthFactor] = useState<string>();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const [isRepayAll, setRepayAll] = useState(false);

  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
  });

  const { getRepayHealth } = useHealthFactor();

  useEffect(() => {
    if (payAmount) {
      getRepayHealth(payAmount).then(setHealthFactor);
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

  const onConfirm = () => {
    if (decimals) {
      const amountIn = parseUnits(payAmount, decimals);
      const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;
      if (isRepayAll) {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'returnSLC',
          args: [amountIn],
        });
      } else {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'returnSLC',
          args: [amountIn],
        });
      }
    }
  };

  const onRepayAllChange = async (checked: boolean) => {
    setRepayAll(checked);
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
    isRepayAll,
    onRepayAllChange,
  };
};

export default useRepaySLC;
