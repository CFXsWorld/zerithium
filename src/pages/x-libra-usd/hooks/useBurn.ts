import { useCallback, useEffect, useMemo, useState } from 'react';
import { Token } from '@/types/swap.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import { SLCToken, ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import useCalcBurnAmount from './useCalcBurnAmount.ts';
import { isNumeric } from '@/utils/isNumeric.ts';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { parseUnits } from 'ethers';
import useSLCContract from '@/hooks/useSLCContract.ts';
import { formatUnits } from 'ethers';

const useBurnSLC = () => {
  const { getBalance } = useErc20Balance();
  const [inputToken] = useState<Token | undefined>(SLCToken);
  const [outputToken, setOutputToken] = useState<Token | undefined>();
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const [outputOwnerAmount, setOutputOwnerAmount] = useState(0);
  const [inputTokenTotalPrice, setInputTokenTotalPrice] = useState(0);
  const [outputTokenTotalPrice, setOutputTokenTotalPrice] = useState(0);
  const contract = useSLCContract();

  const { autoGetReceiveAmount } = useCalcBurnAmount({
    setReceiveAmount,
  });

  useEffect(() => {
    contract.getSlcValue().then((value) => {
      const unitPrice = Number(formatUnits(value));
      setInputTokenTotalPrice(
        formatNumber(Number(payAmount || 0) * unitPrice, 2)
      );
    });
  }, [payAmount]);

  useEffect(() => {
    contract.getSlcValue().then((value) => {
      const unitPrice = Number(formatUnits(value));
      setOutputTokenTotalPrice(
        formatNumber(Number(receiveAmount || 0) * unitPrice, 2)
      );
    });
  }, [receiveAmount]);

  const { getRealAddress, isNativeToken, getNativeTokenBalance } =
    useNativeToken();

  useEffect(() => {
    if (inputToken?.address) {
      if (isNativeToken(inputToken)) {
        getNativeTokenBalance().then(setInputOwnerAmount);
      } else {
        getBalance(inputToken.address).then(setInputOwnerAmount);
      }
    }
  }, [inputToken]);
  useEffect(() => {
    if (outputToken?.address) {
      if (isNativeToken(outputToken)) {
        getNativeTokenBalance().then(setOutputOwnerAmount);
      } else {
        getBalance(outputToken.address).then(setOutputOwnerAmount);
      }
    }
  }, [outputToken]);

  const onOutputTokenChange = useCallback(
    (token: Token) => {
      setOutputToken(token);
      if (payAmount) {
        autoGetReceiveAmount({ outputToken: token, inputToken, payAmount });
      }
    },
    [inputToken?.address, payAmount]
  );

  const onPayAmountChange = useCallback(
    (value: string) => {
      setPayAmount(value);
      if (!value) {
        setReceiveAmount('');
      } else {
        autoGetReceiveAmount({ outputToken, inputToken, payAmount: value });
      }
    },
    [outputToken?.address]
  );

  const fromPairUnit = useMemo(() => {
    if (
      isNumeric(receiveAmount) &&
      isNumeric(payAmount) &&
      outputTokenTotalPrice &&
      inputTokenTotalPrice
    ) {
      const amount = formatNumber(Number(receiveAmount) / Number(payAmount), 8);

      return {
        amount,
        price: formatNumber(
          (Number(outputTokenTotalPrice) / Number(receiveAmount)) *
            Number(amount),
          4
        ),
      };
    }
    return {
      amount: 0,
      price: 0,
    };
  }, [payAmount, receiveAmount, outputTokenTotalPrice, inputTokenTotalPrice]);

  const toPairUnit = useMemo(() => {
    if (
      isNumeric(receiveAmount) &&
      isNumeric(payAmount) &&
      outputTokenTotalPrice &&
      inputTokenTotalPrice
    ) {
      const amount = formatNumber(Number(payAmount) / Number(receiveAmount), 8);
      return {
        amount,
        price: formatNumber(
          (Number(inputTokenTotalPrice) / Number(payAmount)) * Number(amount),
          4
        ),
      };
    }
    return {
      amount: 0,
      price: 0,
    };
  }, [payAmount, receiveAmount, outputTokenTotalPrice, inputTokenTotalPrice]);

  const isReady = useMemo(() => {
    return !!(
      isNumeric(receiveAmount) &&
      isNumeric(payAmount) &&
      inputToken?.address &&
      outputToken?.address
    );
  }, [inputToken, outputToken, payAmount, receiveAmount]);

  const isInsufficient = useMemo(() => {
    return !!(
      inputToken?.address &&
      isNumeric(payAmount) &&
      Number(payAmount) > Number(inputOwnerAmount)
    );
  }, [payAmount, inputOwnerAmount, inputToken?.address]);

  const { writeContractAsync, isSubmittedLoading } = useXWriteContract({});

  const { data: decimals } = useReadContract({
    address: getRealAddress(inputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const onConfirm = () => {
    if (decimals && receiveAmount && outputToken) {
      const amountIn = parseUnits(payAmount, decimals);
      const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'burnSLC',
        args: [outputToken?.address, amountIn],
      });
    }
  };

  return {
    inputToken,
    outputToken,
    payAmount,
    receiveAmount,
    inputOwnerAmount,
    outputOwnerAmount,
    outputTokenTotalPrice,
    inputTokenTotalPrice,
    toPairUnit,
    fromPairUnit,
    isInsufficient,
    isReady,
    onConfirm,
    setOutputToken: onOutputTokenChange,
    setPayAmount: onPayAmountChange,
    isSubmittedLoading,
  };
};

export default useBurnSLC;
