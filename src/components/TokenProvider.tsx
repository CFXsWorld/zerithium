import { PropsWithChildren, useRef, useEffect } from 'react';
import { StoreApi } from 'zustand';
import { createTokenStore, TokenContext, TokenState } from '@/store/tokens.ts';
import useTokenStore from '@/store/tokens.ts';
import useTokensWithPrice from '@/hooks/useTokensWithPrice.ts';

export const Container = ({ children }: PropsWithChildren) => {
  const { updateTokens } = useTokenStore((state) => state);
  const { tokens } = useTokensWithPrice();

  useEffect(() => {
    if (tokens.length) {
      updateTokens(tokens);
    }
  }, [tokens]);

  return children;
};

const TokenProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<StoreApi<TokenState>>();

  if (!storeRef.current) {
    storeRef.current = createTokenStore();
  }
  return (
    <TokenContext.Provider value={storeRef.current || null}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenProvider;
