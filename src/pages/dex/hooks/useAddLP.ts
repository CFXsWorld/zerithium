import { useCallback, useEffect, useMemo, useState } from 'react';
import useLP from '@/pages/dex/hooks/useLP.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import { Token } from '@/types/swap.ts';
import { formatEther, getAddress } from 'ethers';
import { isNumeric } from '@/utils/isNumeric.ts';
import { isSLCToken, ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import useSetDefaultTokens from '@/hooks/useSetDefaultTokens';

type Step = 'FILL' | 'CONFIRM';

export interface LpPairInfo {
  tokenALPTotal: string;
  tokenBLPTotal: string;
  pairAddress: string;
  lpTotalSupply: string;
  lpPair: string[];
  isInitialPool: boolean;
}
export interface LiquidityReturnType {
  isReady: boolean;
  loading: boolean;
  tokenAMinimum1000: boolean;
  tokenBMinimum1000: boolean;
  tokenA?: Token;
  tokenB?: Token;
  tokenAAmount: string;
  tokenBAmount: string;
  tokenAOwnerAmount: number;
  tokenBOwnerAmount: number;
  tokenASLCPairAddress?: string;
  tokenBSLCPairAddress?: string;
  onTokenBAmountChange: (amount: string) => void;
  onTokenAAmountChange: (amount: string) => void;
  onTokenBChange: (token: Token) => void;
  onTokenAChange: (token: Token) => void;
  shareOfPool: number;
  lpTokens: number;
  tokenBTotalPrice: number;
  tokenATotalPrice: number;
  lpPairInfo?: LpPairInfo;
  step: Step;
  setStep: (step: Step) => void;
}

const useAddLP = (): LiquidityReturnType => {
  const [step, setStep] = useState<Step>('FILL');
  const { getBalance, getTotalSupply } = useErc20Balance();
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [tokenA, setTokenA] = useState<Token | undefined>();
  const [tokenB, setTokenB] = useState<Token | undefined>();
  const [tokenAOwnerAmount, setTokenAOwnerAmount] = useState(0);
  const [tokenBOwnerAmount, setTokenBOwnerAmount] = useState(0);
  const [tokenAUnitPrice, setTokenAUnitPrice] = useState(0);
  const [tokenBUnitPrice, setTokenBUnitPrice] = useState(0);
  const [SLCUnitPrice, setSLCUnitPrice] = useState(0);

  const [tokenASLCPairAddress, setTokenAPairAddress] = useState<
    string | undefined
  >();
  const [tokenBSLCPairAddress, setTokenBPairAddress] = useState<
    string | undefined
  >();

  const { getRealAddress } = useNativeToken();

  const [lpPairInfo, setLpPairInfo] = useState<LpPairInfo | undefined>();

  const { getSLCPairAddress, getLpReserve, getLpPair, getPairAddress } =
    useLP();

  const [loading, setLoading] = useState(false);

  const { getLpPrice } = useLP();

  useEffect(() => {
    if (tokenASLCPairAddress) {
      getLpPrice(tokenASLCPairAddress).then(setTokenAUnitPrice);
    }
  }, [tokenASLCPairAddress]);

  useEffect(() => {
    if (tokenBSLCPairAddress) {
      getLpPrice(tokenBSLCPairAddress).then(setTokenBUnitPrice);
    }
  }, [tokenBSLCPairAddress]);

  useEffect(() => {
    if (tokenA?.address) {
      getBalance(tokenA.address).then(setTokenAOwnerAmount);
      getSLCPairAddress(tokenA).then(setTokenAPairAddress);
    }
  }, [tokenA]);
  useEffect(() => {
    if (tokenB?.address) {
      getBalance(tokenB.address).then(setTokenBOwnerAmount);
      getSLCPairAddress(tokenB).then(setTokenBPairAddress);
    }
  }, [tokenB]);

  useEffect(() => {
    getSLCPairAddress({ address: ZERITHIUM_SWAP_CONTRACT.slc.address }).then(
      (pairAddress) => {
        getLpPrice(pairAddress).then(setSLCUnitPrice);
      }
    );
  }, []);

  const tokenATotalPrice = useMemo(
    () =>
      tokenAUnitPrice && tokenAAmount
        ? formatNumber(Number(tokenAAmount) * tokenAUnitPrice, 2)
        : 0,
    [tokenAUnitPrice, tokenAAmount]
  );
  const tokenBTotalPrice = useMemo(
    () =>
      tokenBUnitPrice && tokenBAmount
        ? formatNumber(Number(tokenBAmount) * tokenBUnitPrice, 2)
        : 0,
    [tokenBUnitPrice, tokenBAmount]
  );

  const getLpTotal = async ({
    tokenA,
    tokenB,
  }: {
    tokenA: Token;
    tokenB: Token;
  }) => {
    const pairAddress: string = await getPairAddress(tokenA, tokenB);
    if (!pairAddress) {
      return;
    }
    const lpPair = await getLpPair(pairAddress);

    const totalSupply: bigint = await getTotalSupply(pairAddress);

    const lpTotalSupply = formatEther(totalSupply.toString());

    return getLpReserve(pairAddress).then((reserve) => {
      const invalid = reserve[0].every((unit: bigint) => unit === 0n);
      const tokenAPairIndex = lpPair.findIndex(
        (item) =>
          getAddress(item).toLowerCase() ===
          getAddress(getRealAddress(tokenA)).toLowerCase()
      );
      const tokenBPairIndex = lpPair.findIndex(
        (item) =>
          getAddress(item).toLowerCase() ===
          getAddress(getRealAddress(tokenB)).toLowerCase()
      );

      const tokenALPTotal = formatEther(reserve[0][tokenAPairIndex].toString());
      const tokenBLPTotal = formatEther(reserve[0][tokenBPairIndex].toString());
      return {
        tokenALPTotal,
        tokenBLPTotal,
        pairAddress,
        lpTotalSupply,
        lpPair,
        isInitialPool: !!invalid,
      };
    });
  };
  const calcAmountA = useCallback(
    (valueB: string) => {
      if (lpPairInfo && tokenAUnitPrice && tokenBUnitPrice) {
        const { tokenALPTotal, tokenBLPTotal, isInitialPool } = lpPairInfo;
        if (isInitialPool) {
          if (!isSLCToken(tokenA?.address || '')) {
            const totalB = Number(valueB) * tokenBUnitPrice;
            const amountA = formatNumber(totalB / tokenAUnitPrice, 6);
            setTokenAAmount(amountA + '');
          }
        } else {
          const tokenAAmountRef =
            (Number(valueB) / Number(tokenBLPTotal)) * Number(tokenALPTotal);
          const amount = formatNumber(tokenAAmountRef, 6).toString();
          setTokenAAmount(isNumeric(amount) ? amount : '');
        }
      }
    },
    [lpPairInfo, tokenBUnitPrice, tokenAUnitPrice]
  );

  const calcAmountB = useCallback(
    (valueA: string) => {
      if (lpPairInfo && tokenBUnitPrice) {
        const { tokenALPTotal, tokenBLPTotal, isInitialPool } = lpPairInfo;
        if (isInitialPool) {
          if (!isSLCToken(tokenB?.address || '')) {
            const totalA = Number(valueA) * tokenAUnitPrice;
            const amountB = formatNumber(totalA / tokenBUnitPrice, 6);
            setTokenBAmount(amountB + '');
          }
        } else {
          const tokenBAmountRef =
            (Number(valueA) / Number(tokenALPTotal)) * Number(tokenBLPTotal);
          const amount = formatNumber(tokenBAmountRef, 6).toString();
          setTokenBAmount(isNumeric(amount) ? amount : '');
        }
      }
    },
    [lpPairInfo, tokenBUnitPrice, tokenAUnitPrice]
  );

  const onTokenAChange = useCallback(
    async (token: Token) => {
      setLoading(true);
      setTokenA(token);
      setLpPairInfo(undefined);
      try {
        if (tokenB) {
          const lp = await getLpTotal({
            tokenA: token,
            tokenB,
          });
          setLpPairInfo(lp);
          if (tokenAAmount) {
            calcAmountB(tokenAAmount);
          } else if (tokenBAmount) {
            calcAmountA(tokenBAmount);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [tokenAAmount, tokenB?.address, tokenBAmount]
  );

  const onTokenBChange = useCallback(
    async (token: Token) => {
      setLoading(true);
      setTokenB(token);
      setLpPairInfo(undefined);
      try {
        if (tokenA) {
          const res = await getLpTotal({
            tokenA,
            tokenB: token,
          });
          setLpPairInfo(res);
          if (tokenAAmount) {
            calcAmountB(tokenAAmount);
          } else if (tokenBAmount) {
            calcAmountA(tokenBAmount);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [tokenBAmount, tokenAAmount, tokenA?.address]
  );

  useSetDefaultTokens(['tokena', 'tokenb'], async ([tokenA, tokenB]) => {
    setTokenA(tokenA);
    setTokenB(tokenB);
    const res = await getLpTotal({
      tokenA,
      tokenB,
    });
    setLpPairInfo(res);
  });

  const onTokenAAmountChange = useCallback(
    (value: string) => {
      setTokenAAmount(value);
      if (tokenA && tokenB && lpPairInfo) {
        calcAmountB(value);
      }
    },
    [tokenA?.address, tokenB?.address, lpPairInfo]
  );

  const onTokenBAmountChange = useCallback(
    (value: string) => {
      setTokenBAmount(value);
      if (tokenA && tokenB && lpPairInfo) {
        calcAmountA(value);
      }
    },
    [tokenA?.address, tokenB?.address, lpPairInfo]
  );

  const isReady = useMemo(() => {
    return !!(
      isNumeric(tokenAAmount) &&
      isNumeric(tokenBAmount) &&
      tokenA?.address &&
      tokenB?.address
    );
  }, [tokenAAmount, tokenBAmount, tokenA, tokenB, lpPairInfo]);

  const tokenAMinimum1000 = useMemo(() => {
    if (tokenA?.address && tokenB?.address) {
      if (isSLCToken(tokenB?.address)) {
        return true;
      } else {
        if (lpPairInfo?.isInitialPool && SLCUnitPrice && tokenA?.address) {
          return tokenATotalPrice >= 100 * SLCUnitPrice;
        }
      }
    }
    return true;
  }, [lpPairInfo, tokenATotalPrice, SLCUnitPrice]);

  const tokenBMinimum1000 = useMemo(() => {
    if (tokenA?.address && tokenB?.address) {
      if (isSLCToken(tokenA?.address)) {
        return true;
      } else {
        if (lpPairInfo?.isInitialPool && SLCUnitPrice) {
          return tokenBTotalPrice >= 100 * SLCUnitPrice;
        }
      }
    }
    return true;
  }, [lpPairInfo, tokenBTotalPrice, SLCUnitPrice]);

  const shareOfPool = useMemo(() => {
    if (lpPairInfo?.isInitialPool) {
      return 100;
    }
    if (isNumeric(tokenAAmount) && lpPairInfo) {
      const { tokenALPTotal } = lpPairInfo;
      return formatNumber(
        (Number(tokenAAmount) /
          (Number(tokenAAmount) + Number(tokenALPTotal))) *
          100,
        2
      );
    }
    return 0;
  }, [lpPairInfo, tokenAAmount]);

  const lpTokens = useMemo(() => {
    if (lpPairInfo?.isInitialPool) {
      if (isSLCToken(tokenA?.address || '') && isNumeric(tokenAAmount)) {
        return Number(tokenAAmount);
      }
      if (isSLCToken(tokenB?.address || '') && isNumeric(tokenBAmount)) {
        return Number(tokenBAmount);
      }
    }
    if (isNumeric(tokenAAmount) && lpPairInfo) {
      const { lpTotalSupply, tokenALPTotal } = lpPairInfo;

      return formatNumber(
        (Number(tokenAAmount) / Number(tokenALPTotal)) * Number(lpTotalSupply),
        6
      );
    }
    return 0;
  }, [lpPairInfo, tokenAAmount, tokenBAmount]);

  return {
    isReady,
    tokenA,
    tokenB,
    tokenAAmount,
    tokenBAmount,
    tokenAOwnerAmount,
    tokenBOwnerAmount,
    tokenASLCPairAddress,
    tokenBSLCPairAddress,
    onTokenBAmountChange,
    onTokenAAmountChange,
    onTokenBChange,
    onTokenAChange,
    shareOfPool,
    lpTokens,
    step,
    setStep,
    lpPairInfo,
    loading,
    tokenATotalPrice,
    tokenBTotalPrice,
    tokenAMinimum1000,
    tokenBMinimum1000,
  };
};

export default useAddLP;
