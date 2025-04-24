import { useCallback, useEffect, useMemo, useState } from 'react';
import { SwapRoute, Token } from '@/types/swap.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import usePair from '@/pages/dex/hooks/usePair.ts';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import useLP from '@/pages/dex/hooks/useLP.ts';
import useCalcAmount from '@/pages/dex/hooks/useCalcAmount.ts';
import { isNumeric } from '@/utils/isNumeric.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import useSetDefaultToken from '@/hooks/useSetDefaultToken';

type SwapStep = 'FILL' | 'CONFIRM';

export interface SwapReturnType {
  slippage: string;
  priceImpact: number;
  fee: number;
  feeAmount: number;
  estReceived: number;
  minReceived: number;
  outputToken?: Token;
  inputToken?: Token;
  toPairUnit?: { amount: number; price: number };
  fromPairUnit?: { amount: number; price: number };
  setSlippage: (v: string) => void;
  onExchange: () => void;
  setInputToken: (token: Token) => void;
  setOutputToken: (token: Token) => void;
  payAmount: string;
  setPayAmount: (amount: string) => void;
  receiveAmount: string;
  setReceiveAmount: (amount: string) => void;
  inputOwnerAmount: number;
  outputOwnerAmount: number;
  deadline: string;
  setDeadline: (amount: string) => void;
  outputTokenTotalPrice: number;
  inputTokenTotalPrice: number;
  isInsufficient: boolean;
  isReady: boolean;
  isInsufficientLiquidity: boolean;
  swapStep?: SwapStep;
  onConfirm?: () => void;
  onFillSwap?: () => void;
  router?: SwapRoute;
  isTokenBLoading?: boolean;
  isTokenALoading?: boolean;
}

const useSwap = ({
  receiveToken,
  onReceiveChange,
}: {
  receiveToken?: Token;
  onReceiveChange?: (token?: Token) => void;
}): SwapReturnType => {
  const { getBalance } = useErc20Balance();
  const { isNativeToken, getNativeTokenBalance } = useNativeToken();
  const [slippage, setSlippage] = useState('1');
  const [inputToken, setInputToken] = useState<Token | undefined>();
  const [outputToken, setOutputToken] = useState<Token | undefined>();
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const [outputOwnerAmount, setOutputOwnerAmount] = useState(0);
  const [deadline, setDeadline] = useState('10');
  const [inputTokenTotalPrice, setInputTokenTotalPrice] = useState(0);
  const [outputTokenTotalPrice, setOutputTokenTotalPrice] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);
  const [fee, setFee] = useState(0);

  const [swapStep, setStep] = useState<SwapStep>('FILL');

  const [isInsufficientLiquidity, setIsInsufficientLiquidity] = useState(false);

  useSetDefaultToken('pay', setInputToken);
  useSetDefaultToken('receive', setOutputToken);

  const {
    autoGetPayAmount,
    autoGetReceiveAmount,
    router,
    isTokenBLoading,
    isTokenALoading,
  } = useCalcAmount({
    setIsInsufficientLiquidity,
    setPayAmount,
    setFee,
    setPriceImpact,
    setInputTokenTotalPrice,
    setReceiveAmount,
    setOutputTokenTotalPrice,
  });

  useEffect(() => {
    if (receiveToken) {
      setOutputToken(receiveToken);
    }
  }, [receiveToken]);

  const { pairAddress: fromWithSLCPairAddress } = usePair({
    fromToken: inputToken,
    toToken: { address: ZERITHIUM_SWAP_CONTRACT.slc.address },
  });

  const { pairAddress: toWithSLCPairAddress } = usePair({
    fromToken: outputToken,
    toToken: { address: ZERITHIUM_SWAP_CONTRACT.slc.address },
  });

  const { getLpPrice } = useLP();

  useEffect(() => {
    if (fromWithSLCPairAddress && payAmount) {
      getLpPrice(fromWithSLCPairAddress).then((unitPrice) => {
        setInputTokenTotalPrice(formatNumber(Number(payAmount) * unitPrice, 4));
      });
    }
  }, [fromWithSLCPairAddress, payAmount]);

  useEffect(() => {
    if (toWithSLCPairAddress && receiveAmount) {
      getLpPrice(toWithSLCPairAddress).then((unitPrice) => {
        setOutputTokenTotalPrice(
          formatNumber(Number(receiveAmount) * unitPrice, 4)
        );
      });
    }
  }, [toWithSLCPairAddress, receiveAmount]);

  const onExchange = () => {
    if (inputToken || outputToken) {
      setOutputToken(inputToken);
      setInputToken(outputToken);
      setPayAmount('');
      setReceiveAmount('');
      setInputTokenTotalPrice(0);
      setOutputTokenTotalPrice(0);
    }
  };

  const feeAmount = useMemo(() => {
    if (fee && outputTokenTotalPrice) {
      return formatNumber(Number(outputTokenTotalPrice || 0) * (fee / 100), 7);
    }
    return 0;
  }, [fee, outputTokenTotalPrice]);

  const minReceived = useMemo(() => {
    if (slippage && isNumeric(receiveAmount)) {
      const slippedAmount =
        (Number(slippage === '-1' ? '0.5' : slippage) / 100) *
        Number(receiveAmount);
      return formatNumber(Number(receiveAmount || 0) - slippedAmount, 7);
    }

    return 0;
  }, [receiveAmount, slippage]);
  const estReceived = useMemo(() => {
    if (isNumeric(receiveAmount)) {
      return formatNumber(Number(receiveAmount || 0), 7);
    }

    return 0;
  }, [receiveAmount]);

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

  const onInputTokenChange = useCallback(
    (token: Token) => {
      setInputToken(token);
      if (payAmount) {
        autoGetReceiveAmount({ outputToken, inputToken: token, payAmount });
      } else {
        autoGetPayAmount({ outputToken, inputToken: token, receiveAmount });
      }
    },
    [outputToken?.address, receiveAmount]
  );

  const onOutputTokenChange = useCallback(
    (token: Token) => {
      setOutputToken(token);
      onReceiveChange?.(token);
      if (receiveAmount) {
        autoGetPayAmount({ outputToken: token, inputToken, receiveAmount });
      } else {
        autoGetReceiveAmount({ outputToken: token, inputToken, payAmount });
      }
    },
    [inputToken?.address, payAmount]
  );

  const onPayAmountChange = useCallback(
    (value: string) => {
      setPayAmount(value);
      autoGetReceiveAmount({ outputToken, inputToken, payAmount: value });
    },
    [inputToken?.address, outputToken?.address, receiveAmount]
  );

  const onReceiveAmountChange = useCallback(
    (value: string) => {
      setReceiveAmount(value);
      autoGetPayAmount({ outputToken, inputToken, receiveAmount: value });
    },
    [inputToken?.address, outputToken?.address, payAmount]
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

  const onConfirm = () => {
    setStep('CONFIRM');
  };

  const onFillSwap = () => {
    setStep('FILL');
  };

  return {
    toPairUnit,
    fromPairUnit,
    isInsufficient,
    isReady,
    slippage,
    setSlippage,
    onExchange,
    inputToken,
    setInputToken: onInputTokenChange,
    setOutputToken: onOutputTokenChange,
    setPayAmount: onPayAmountChange,
    setReceiveAmount: onReceiveAmountChange,
    outputToken,
    payAmount,
    receiveAmount,
    priceImpact,
    fee,
    feeAmount,
    estReceived,
    minReceived,
    inputOwnerAmount,
    outputOwnerAmount,
    deadline,
    setDeadline,
    inputTokenTotalPrice,
    outputTokenTotalPrice,
    isInsufficientLiquidity,
    onConfirm,
    onFillSwap,
    swapStep,
    router,
    isTokenBLoading,
    isTokenALoading,
  };
};

export default useSwap;
