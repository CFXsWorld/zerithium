import { Token } from '@/types/swap';
import { useSearchParams } from 'react-router-dom';
import useErc20Info from './useERC20TokenInfo';
import useTokenStore from '@/store/tokens';
import { useEffect, useState } from 'react';
import { Address, isAddress } from 'viem';

const useSetDefaultToken = (name: string, update: (token: Token) => void) => {
  const tokens = useTokenStore((state) => state.tokens);

  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const { fetchTokenInfo } = useErc20Info();

  useEffect(() => {
    if (name && params?.get(name) && tokens.length) {
      try {
        setLoading(true);
        const address = params?.get(name) as Address;
        if (isAddress(address)) {
          const token = tokens.find(
            (item) => item?.address.toLowerCase() === address.toLowerCase()
          );
          if (token) {
            update(token);
          } else {
            fetchTokenInfo(address).then((res) => {
              if (res) {
                update(res);
              }
            });
          }
        }
      } finally {
        setLoading(false);
      }
    }
  }, [name, tokens]);

  return { loading };
};

export default useSetDefaultToken;
