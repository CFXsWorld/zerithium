import { Token } from '@/types/swap';
import useErc20Info from './useERC20TokenInfo';
import useTokenStore from '@/store/tokens';
import { useEffect, useState } from 'react';
import { isAddress } from 'viem';

const useSetToken = (address: string, update: (token: Token) => void) => {
  const tokens = useTokenStore((state) => state.tokens);

  const [loading, setLoading] = useState(false);

  const { fetchTokenInfo } = useErc20Info();

  useEffect(() => {
    if (address && tokens.length) {
      try {
        setLoading(true);
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
  }, [address, tokens]);

  return { loading };
};

export default useSetToken;
