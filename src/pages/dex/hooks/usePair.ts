import { Token } from '@/types/swap.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useSwapContract from '@/hooks/useSwapContract.ts';
import { isSLCToken, ZERITHIUM_SWAP_CONTRACT, ZERO_ADDRESS } from '@/contracts';
import useNativeToken from '@/hooks/useNativeToken.ts';

const usePair = ({
  fromToken,
  toToken,
}: {
  fromToken?: Token;
  toToken?: Token;
}) => {
  const [pairAddress, setPairAddress] = useState('');
  const contract = useSwapContract();

  const { getRealAddress } = useNativeToken();

  const toAddress = useMemo(() => {
    return isSLCToken(fromToken?.address || '') &&
      isSLCToken(toToken?.address || '')
      ? ZERITHIUM_SWAP_CONTRACT.usdt.address
      : getRealAddress(toToken!);
  }, [fromToken?.address, toToken?.address]);

  const getPairAddress = useCallback(async () => {
    if (fromToken?.address && toToken?.address) {
      const pairAddress = await contract.getPair(
        getRealAddress(fromToken!),
        toAddress
      );
      if (pairAddress === ZERO_ADDRESS) {
        setPairAddress('');
      } else {
        setPairAddress(pairAddress);
      }
    }
  }, [fromToken?.address, toToken?.address]);

  useEffect(() => {
    if (fromToken?.address && toAddress) {
      getPairAddress();
    }
  }, [fromToken?.address, toAddress]);

  return {
    pairAddress,
  };
};

export default usePair;
