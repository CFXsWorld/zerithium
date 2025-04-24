import { useCallback, useEffect, useMemo, useState } from 'react';
import useLP from '@/pages/dex/hooks/useLP.ts';
import useErc20Balance from '@/hooks/useErc20Balance.ts';
import { Token } from '@/types/swap.ts';
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { Address, erc20Abi } from 'viem';
import useNativeToken from '@/hooks/useNativeToken.ts';
import usePendingNotice from '@/components/notices/usePendingNotice.tsx';
import useWalletAuth from '@/components/Wallet/useWalletAuth';
import useSetDefaultToken from '@/hooks/useSetDefaultToken';
import { parseUnits } from 'ethers';

const useCreatePool = () => {
  const { disabled: invalidWallet } = useWalletAuth();
  const { getBalance } = useErc20Balance();
  const [tokenA, setTokenA] = useState<Token | undefined>();
  const [tokenB, setTokenB] = useState<Token | undefined>();
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [tokenAOwnerAmount, setTokenAOwnerAmount] = useState(0);
  const [tokenBOwnerAmount, setTokenBOwnerAmount] = useState(0);
  const [tokenASLCPairAddress, setTokenAPairAddress] = useState<
    string | undefined
  >();
  const [tokenBSLCPairAddress, setTokenBPairAddress] = useState<
    string | undefined
  >();
  const [lpPairAddress, setLpPairAddress] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { writeTxNotification } = usePendingNotice();
  const { getSLCPairAddress, getPairAddress } = useLP();

  const { isNativeToken, getNativeTokenERC20Address } = useNativeToken();

  useSetDefaultToken('tokenA', setTokenA);
  useSetDefaultToken('tokenB', setTokenB);

  const getRealAddress = (token: Token) => {
    if (isNativeToken(token)) {
      return getNativeTokenERC20Address(token);
    }
    return token?.address;
  };

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
    if (tokenB?.address && tokenA?.address) {
      getPairAddress(tokenA, tokenB).then(setLpPairAddress);
    }
  }, [tokenB, tokenA]);

  const { data: hash, writeContractAsync } = useWriteContract();

  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (isSuccess && hash) {
      setLoading(false);
      writeTxNotification(hash);
      if (tokenB?.address && tokenA?.address) {
        getPairAddress(tokenA, tokenB).then(setLpPairAddress);
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setLoading(false);
    }
  }, [isError]);

  const onTokenAChange = useCallback(
    async (token: Token) => {
      setTokenA(token);
    },
    [tokenB?.address]
  );

  const onTokenBChange = useCallback(
    async (token: Token) => {
      setTokenB(token);
    },
    [tokenA?.address]
  );

  const { data: tokenADecimals } = useReadContract({
    address: getRealAddress(tokenA!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const { data: tokenBDecimals } = useReadContract({
    address: getRealAddress(tokenB!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const sortedAmounts = useMemo(() => {
    if (!tokenADecimals || !tokenBDecimals) return [];

    if (tokenAAmount && tokenBAmount) {
      const amountIn = parseUnits(tokenAAmount, tokenADecimals);
      const amountOut = parseUnits(tokenBAmount, tokenBDecimals);

      return [amountIn, amountOut];
    }
    return [];
  }, [tokenAAmount, tokenBAmount, tokenADecimals, tokenBDecimals]);

  const txValue = useMemo(() => {
    if (isNativeToken(tokenA!) && tokenADecimals) {
      return Number(tokenAAmount) * 10 ** tokenADecimals;
    }
    if (isNativeToken(tokenB!) && tokenBDecimals) {
      return Number(tokenBAmount) * 10 ** tokenBDecimals;
    }
    return 0;
  }, [tokenAAmount, tokenBAmount, tokenADecimals, tokenBDecimals]);

  const onCreate = () => {
    setLoading(true);
    if (tokenB && tokenA) {
      const { address, abi } = ZERITHIUM_SWAP_CONTRACT.interface;

      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'createLpAndSubscribeInitLiq',
        args: [getRealAddress(tokenA), getRealAddress(tokenB), sortedAmounts],
        value: `${txValue}` as unknown as bigint,
      }).catch(() => {
        setLoading(false);
      });
    }
  };

  const disabled = useMemo(() => {
    if (!tokenAAmount || Number(tokenAAmount) < 0.0000001) {
      return true;
    }
    if (!tokenBAmount || Number(tokenBAmount) < 0.0000001) {
      return true;
    }
    return invalidWallet || !tokenA?.address || !tokenB?.address;
  }, [tokenA, tokenAAmount, tokenBAmount, invalidWallet]);

  const onTokenAAmountChange = useCallback((value: string) => {
    setTokenAAmount(value);
  }, []);

  const onTokenBAmountChange = useCallback((value: string) => {
    setTokenBAmount(value);
  }, []);

  return {
    tokenA,
    tokenB,
    tokenAOwnerAmount,
    tokenBOwnerAmount,
    lpPairAddress,
    tokenASLCPairAddress,
    tokenBSLCPairAddress,
    onTokenBChange,
    onTokenAChange,
    onCreate,
    loading,
    onTokenAAmountChange,
    onTokenBAmountChange,
    tokenAAmount,
    tokenBAmount,
    invalidWallet,
    disabled,
  };
};

export default useCreatePool;
