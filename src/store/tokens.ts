import { Token } from '@/types/swap.ts';
import { createStore, StoreApi, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';
import { LendingAsset } from '@/types/Lending.ts';

export interface TokenState {
  tokens: Token[];
  updateTokens: (tokens: Token[]) => void;
  assets: LendingAsset[];
  updateAssets: (assets: LendingAsset[]) => void;
}

export const TokenContext = createContext<StoreApi<TokenState> | null>(null);

export const createTokenStore = () =>
  createStore<TokenState>()(
    persist(
      immer((set) => ({
        tokens: [],
        assets: [],
        updateTokens: (tokens) =>
          set((state) => {
            state.tokens = tokens;
          }),
        updateAssets: (assets) =>
          set((state) => {
            state.assets = assets;
          }),
      })),
      {
        name: 'x-pending-transactions',
      }
    )
  );

export const useTokenStore = <T>(selector: (state: TokenState) => T): T => {
  const store = useContext(TokenContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }

  return useStore(store, selector);
};

export default useTokenStore;
