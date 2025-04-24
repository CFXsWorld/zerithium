import { useCallback } from 'react';
import useSwapContract from '@/hooks/useSwapContract.ts';
import { formatUnits } from 'ethers';
import { isSLCToken, ZERITHIUM_SWAP_CONTRACT, ZERO_ADDRESS } from '@/contracts';
import { Token } from '@/types/swap.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';

const useLP = () => {
  const contract = useSwapContract();
  const { isNativeToken, getNativeTokenERC20Address, getRealAddress } =
    useNativeToken();

  const getSLCPairAddress = async (token: Token) => {
    let tokenAddress = token?.address;
    if (isSLCToken(token?.address)) {
      tokenAddress = ZERITHIUM_SWAP_CONTRACT.usdt.address;
    }

    if (isNativeToken(token)) {
      tokenAddress = getNativeTokenERC20Address(token);
    }
    return await contract
      .getCoinToStableLpPair(tokenAddress)
      .then((res) => (res === ZERO_ADDRESS ? '' : res));
  };
  const getLpReserve = async (lpAddress: string) => {
    return await contract.getLpReserve(lpAddress);
  };

  const getLpPair = async (lpAddress: string): Promise<string[]> => {
    return await contract.getLpPair(lpAddress);
  };
  const getPairAddress = async (tokenA: Token, tokenB: Token) => {
    return await contract
      .getPair(getRealAddress(tokenA), getRealAddress(tokenB))
      .then((res) => (res === ZERO_ADDRESS ? '' : res));
  };

  const getLpPrice = useCallback(async (lpAddress: string) => {
    const lpPrice = await contract.getLpPrice(lpAddress);
    return Number(formatUnits(lpPrice));
  }, []);

  return {
    getLpPrice,
    getSLCPairAddress,
    getLpReserve,
    getLpPair,
    getPairAddress,
  };
};

export default useLP;
