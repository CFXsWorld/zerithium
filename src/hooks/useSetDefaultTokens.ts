import { Token } from '@/types/swap';
import { useSearchParams } from 'react-router-dom';
import useErc20Info from './useERC20TokenInfo';
import useTokenStore from '@/store/tokens';
import { useEffect, useState } from 'react';
import { Address, isAddress } from 'viem';

const useSetDefaultTokens = (
  names: string[],
  update: (tokens: Token[]) => void
) => {
  const tokens = useTokenStore((state) => state.tokens);

  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const { fetchTokenInfo } = useErc20Info();

  const updater = async (names: string[]) => {
    const tokensSets = [];
    for (const name of names) {
      const address = params?.get(name) as Address;
      if (isAddress(address)) {
        const token = tokens.find(
          (item) => item?.address.toLowerCase() === address.toLowerCase()
        );
        const item = token
          ? token
          : await fetchTokenInfo(address).catch(() => null);
        tokensSets.push(item);
      }
    }
    return tokensSets;
  };
  useEffect(() => {
    if (names.length && params?.get(names[0]) && tokens.length) {
      try {
        setLoading(true);
        updater(names).then((tokensSets) => {
          update(tokensSets as Token[]);
        });
      } finally {
        setLoading(false);
      }
    }
  }, [names.length, tokens.length]);

  return { loading };
};

export default useSetDefaultTokens;
