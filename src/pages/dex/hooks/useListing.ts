import { useCallback, useEffect, useMemo, useState } from 'react';
import useLP from '@/pages/dex/hooks/useLP.ts';
import useErc20Balance from '@/hooks/useErc20Balance.ts';
import { Token } from '@/types/swap.ts';
import { useReadContract } from 'wagmi';
import { SLCToken, ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { Address, erc20Abi } from 'viem';
import useNativeToken from '@/hooks/useNativeToken.ts';
import useWalletAuth from '@/components/Wallet/useWalletAuth';
import { parseUnits } from 'ethers';
import useSetDefaultToken from '@/hooks/useSetDefaultToken';
import { useCommonStore } from '@/store/common';

import useXWriteContract from '@/hooks/useXWriteContract.ts';

const useListing = () => {
  const listingLimit = useCommonStore((state) => state.swapLimit?.[0] || 200);

  const { writeContractAsync, isSubmittedLoading: loading } = useXWriteContract(
    {}
  );

  const tokenB = SLCToken;
  const { disabled: invalidWallet } = useWalletAuth();
  const { getBalance } = useErc20Balance();
  const [tokenA, setTokenA] = useState<Token | undefined>();
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

  const { getSLCPairAddress, getPairAddress } = useLP();

  const { isNativeToken, getNativeTokenERC20Address } = useNativeToken();

  const getRealAddress = (token: Token) => {
    if (isNativeToken(token)) {
      return getNativeTokenERC20Address(token);
    }
    return token?.address;
  };

  useSetDefaultToken('tokenA', setTokenA);

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

  const onTokenAAmountChange = useCallback(
    (value: string) => {
      setTokenAAmount(value);
    },
    [tokenA?.address, tokenB?.address]
  );

  const onTokenAChange = useCallback(
    async (token: Token) => {
      setTokenA(token);
    },
    [tokenB?.address]
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
    if (tokenB && tokenA) {
      const { address, abi } = ZERITHIUM_SWAP_CONTRACT.interface;

      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'createLpAndSubscribeInitLiq',
        args: [getRealAddress(tokenA), getRealAddress(tokenB), sortedAmounts],
        value: `${txValue}` as unknown as bigint,
      });
    }
  };

  const disabled = useMemo(() => {
    if (!tokenAAmount || Number(tokenAAmount) < 0.0000001) {
      return true;
    }
    if (!tokenBAmount || Number(tokenBAmount) < listingLimit) {
      return true;
    }
    return invalidWallet || !tokenA?.address || !!lpPairAddress;
  }, [tokenA, tokenAAmount, tokenBAmount, invalidWallet, lpPairAddress]);

  return {
    tokenA,
    tokenB,
    tokenAOwnerAmount,
    tokenBOwnerAmount,
    lpPairAddress,
    tokenASLCPairAddress,
    tokenBSLCPairAddress,
    onTokenAChange,
    onCreate,
    loading,
    tokenAAmount,
    onTokenAAmountChange,
    invalidWallet,
    tokenBAmount,
    setTokenBAmount,
    disabled,
  };
};

export default useListing;
