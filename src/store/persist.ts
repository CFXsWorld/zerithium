import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Locale } from '@/i18n';

type WalletType = 'metamask' | 'fluent' | null;

interface CommonState {
  locale?: Locale;
  updateLocale: (lang: Locale) => void;
  theme?: 'dark' | 'light' | string;
  updateTheme: (theme: string) => void;
  wallet: WalletType;
  updateWallet: (wallet: WalletType) => void;
}

export const usePersistStore = create<CommonState>()(
  persist(
    immer((set) => ({
      wallet: null,
      updateWallet: (wallet) =>
        set((state) => {
          state.wallet = wallet;
        }),
      locale: 'en-US',
      updateLocale: (locale) =>
        set((state) => {
          state.locale = locale;
        }),
      theme: 'light',
      updateTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),
    })),
    {
      name: 'zerithium-storage',
    }
  )
);
