import { useCallback, useEffect, useMemo, useState } from 'react';
import { Token } from '@/types/swap.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import usePair from '@/pages/dex/hooks/usePair.ts';
import {
  SLCToken,
  ZERITHIUM_SLC_CONTRACT,
  ZERITHIUM_SWAP_CONTRACT,
} from '@/contracts';
import useLP from '@/pages/dex/hooks/useLP.ts';
import { isNumeric } from '@/utils/isNumeric.ts';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { parseUnits } from 'ethers';
import useCalcMintAmount from '@/pages/x-super-libra-coin/hooks/useCalcMintAmount.ts';

const useMintSLC = () => {
  const { getBalance } = useErc20Balance();
  const [inputToken, setInputToken] = useState<Token | undefined>();
  const [outputToken] = useState<Token | undefined>(SLCToken);
  const [payAmount, setPayAmount] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const [outputOwnerAmount, setOutputOwnerAmount] = useState(0);
  const [inputTokenTotalPrice, setInputTokenTotalPrice] = useState(0);
  const [outputTokenTotalPrice, setOutputTokenTotalPrice] = useState(0);

  const [isInsufficientLiquidity, setIsInsufficientLiquidity] = useState(false);

  const { autoGetPayAmount, autoGetReceiveAmount } = useCalcMintAmount({
    setIsInsufficientLiquidity,
    setPayAmount,
    setInputTokenTotalPrice,
    setReceiveAmount,
    setOutputTokenTotalPrice,
  });

  const { pairAddress: fromWithSLCPairAddress } = usePair({
    fromToken: inputToken,
    toToken: { address: ZERITHIUM_SWAP_CONTRACT.slc.address },
  });

  const { pairAddress: toWithSLCPairAddress } = usePair({
    fromToken: outputToken,
    toToken: { address: ZERITHIUM_SWAP_CONTRACT.slc.address },
  });

  const { getLpPrice } = useLP();

  const { getRealAddress, isNativeToken, getNativeTokenBalance } =
    useNativeToken();

  useEffect(() => {
    if (fromWithSLCPairAddress && payAmount) {
      getLpPrice(fromWithSLCPairAddress).then((unitPrice) => {
        setInputTokenTotalPrice(formatNumber(Number(payAmount) * unitPrice, 2));
      });
    }
  }, [fromWithSLCPairAddress, payAmount]);

  useEffect(() => {
    if (toWithSLCPairAddress && receiveAmount) {
      getLpPrice(toWithSLCPairAddress).then((unitPrice) => {
        setOutputTokenTotalPrice(
          formatNumber(Number(receiveAmount) * unitPrice, 2)
        );
      });
    }
  }, [toWithSLCPairAddress, receiveAmount]);

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
    if (decimals && payAmount && inputToken) {
      const amountIn = parseUnits(payAmount, decimals);
      const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;
      if (isNativeToken(inputToken)) {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'buySlcByCFX',
          value: `${amountIn}` as unknown as bigint,
          args: [],
        });
      } else {
        writeContractAsync({
          address: address as Address,
          abi,
          functionName: 'slcTokenBuy',
          args: [inputToken?.address, amountIn],
        });
      }
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
    fromPairUnit,
    isInsufficient,
    isReady,
    isInsufficientLiquidity,
    onConfirm,
    setInputToken: onInputTokenChange,
    setPayAmount: onPayAmountChange,
    setReceiveAmount: onReceiveAmountChange,
    isSubmittedLoading,
  };
};

export default useMintSLC;
