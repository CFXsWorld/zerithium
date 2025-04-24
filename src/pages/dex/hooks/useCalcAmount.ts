import { useState } from 'react';
import { SwapRoute, Token } from '@/types/swap.ts';
import { parseEther } from 'ethers';
import { formatNumber } from '@/hooks/useErc20Balance.ts';

import { isNumeric } from '@/utils/isNumeric.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { useMutation } from '@tanstack/react-query';
import { getSwapRouter } from '@/services/token.ts';
import useBestRoute from '@/pages/dex/hooks/useBestRoute.ts';
import { debounce } from 'lodash';

const useCalcAmount = ({
  setIsInsufficientLiquidity,
  setPayAmount,
  setFee,
  setPriceImpact,
  setInputTokenTotalPrice,
  setReceiveAmount,
  setOutputTokenTotalPrice,
}: {
  setIsInsufficientLiquidity: (value: boolean) => void;
  setPayAmount: (value: string) => void;
  setReceiveAmount: (value: string) => void;
  setFee: (value: number) => void;
  setPriceImpact: (value: number) => void;
  setInputTokenTotalPrice: (value: number) => void;
  setOutputTokenTotalPrice: (value: number) => void;
}) => {
  const [router, setRouter] = useState<SwapRoute>();
  const { mutateAsync: getRoute } = useMutation({
    mutationFn: getSwapRouter,
  });
  const [isTokenALoading, setTokenALoading] = useState(false);
  const [isTokenBLoading, setTokenBLoading] = useState(false);

  const { getBestOutputAmount, getBestInputAmount } = useBestRoute();

  const { getRealAddress } = useNativeToken();

  const getInputAmount = async (tokens: string[], amount: string) => {
    const routes = await getRoute({ tokena: tokens[0], tokenb: tokens[1] });
    return getBestInputAmount(routes, amount);
  };

  const getOutputAmount = async (tokens: string[], amount: string) => {
    const routes = await getRoute({ tokena: tokens[0], tokenb: tokens[1] });
    return getBestOutputAmount(routes, amount);
  };
  const autoGetPayAmount = debounce(
    ({
      outputToken,
      inputToken,
      receiveAmount,
    }: {
      outputToken?: Token;
      inputToken?: Token;
      receiveAmount: string;
    }) => {
      setIsInsufficientLiquidity(false);
      if (
        inputToken?.address &&
        outputToken?.address &&
        isNumeric(receiveAmount)
      ) {
        setTokenALoading(true);
        getInputAmount(
          [getRealAddress(inputToken!), getRealAddress(outputToken!)],
          parseEther(receiveAmount).toString()
        )
          .then(({ amount, route }) => {
            setRouter(route);
            const amountStr = amount[0];
            setPayAmount(formatNumber(Number(amountStr), 8).toString());
            const info = amount[1];
            setFee((Number(info[0].toString()) / 10000) * 100);
            const impact = formatNumber(
              ((Number(info[1]) - Number(info[2])) / (Number(info[2]) || 1)) *
                100,
              2
            );
            setPriceImpact(impact);
          })
          .catch((e) => {
            console.log(e);
            setIsInsufficientLiquidity(true);
            setPayAmount('');
            setInputTokenTotalPrice(0);
          })
          .finally(() => {
            setTokenALoading(false);
          });
      }
    },
    500
  );

  const autoGetReceiveAmount = debounce(
    ({
      outputToken,
      inputToken,
      payAmount,
    }: {
      outputToken?: Token;
      inputToken?: Token;
      payAmount: string;
    }) => {
      setIsInsufficientLiquidity(false);
      if (inputToken?.address && outputToken?.address && isNumeric(payAmount)) {
        setTokenBLoading(true);
        getOutputAmount(
          [getRealAddress(inputToken!), getRealAddress(outputToken!)],
          parseEther(payAmount).toString()
        )
          .then(({ amount, route }) => {
            setRouter(route);
            const amountStr = amount[0];
            setReceiveAmount(formatNumber(Number(amountStr), 8).toString());
            const info = amount[1];
            const impact = formatNumber(
              ((Number(info[1]) - Number(info[2])) / (Number(info[2]) || 1)) *
                100,
              2
            );
            setFee((Number(info[0].toString()) / 10000) * 100);
            setPriceImpact(impact);
          })
          .catch(() => {
            setIsInsufficientLiquidity(true);
            setReceiveAmount('');
            setOutputTokenTotalPrice(0);
          })
          .finally(() => {
            setTokenBLoading(false);
          });
      }
    },
    500
  );

  return {
    autoGetPayAmount,
    autoGetReceiveAmount,
    router,
    isTokenBLoading,
    isTokenALoading,
  };
};

export default useCalcAmount;
