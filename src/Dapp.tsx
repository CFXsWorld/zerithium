import { PropsWithChildren, useEffect } from 'react';
import { useRoutes, HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Locale, useLocale } from '@/i18n';
import { useAccount, WagmiProvider } from 'wagmi';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { injected } from 'wagmi/connectors';
import { IntlProvider } from 'react-intl';
import { createConfig, http } from 'wagmi';
import { ThemeProvider, useTheme } from '@/components/Theme';
import routes from './routes';
import ConnectModal from '@/components/Wallet/ConnectModal.tsx';
import WalletDetailModal from '@/components/Wallet/WalletDetailModal.tsx';
import SubmittedModal from '@/components/modals/SubmittedModal.tsx';
import { antdTableTokens } from '@/styles/reset.ts';
import TXPendingProvider from '@/components/PendingProvider.tsx';
import useSwapContract from './hooks/useSwapContract';
import { useCommonStore } from './store/common';
import zhCN from 'antd/locale/zh_CN';
import zhHK from 'antd/locale/zh_HK';
import enUS from 'antd/locale/en_US';
import zeroGIcon from '@/assets/images/zero.png';
import ChainBlockHeight from './components/ChainBlockHeight';
import TokenProvider from '@/components/TokenProvider';

import { ConnectKitProvider } from 'connectkit';

const Routes = () => useRoutes(routes);

const zeroGTestnet = {
  id: 16601,
  name: '0G Newton Testnet',
  iconUrl: zeroGIcon,
  nativeCurrency: { name: 'A0GI', symbol: 'A0GI', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://evmrpc-testnet.0g.ai/'],
    },
  },
  blockExplorers: {
    default: {
      name: '0G-Newton-Testnet',
      url: 'https://chainscan-newton.0g.ai/',
    },
  },
};

const config = createConfig({
  chains: [zeroGTestnet],
  connectors: [injected({ shimDisconnect: false })],
  transports: {
    [zeroGTestnet.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      retryOnMount: false,
      refetchOnMount: false,
    },
  },
});

const Dapp = ({ children, locale }: PropsWithChildren<{ locale: Locale }>) => {
  const { systemTheme, theme } = useTheme();
  const { address } = useAccount();

  const updateSwapLimit = useCommonStore((state) => state.updateSwapLimit);

  const isDark = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';
  const contract = useSwapContract();

  useEffect(() => {
    contract.minLpAndListLimit().then((res: bigint[]) => {
      updateSwapLimit(res.map((n) => Number(String(n))));
    });
  }, []);

  return (
    <ConfigProvider
      key={address}
      locale={locale === 'zh-CN' ? zhCN : locale === 'zh-HK' ? zhHK : enUS}
      theme={{
        cssVar: true,
        hashed: false,
        algorithm: [
          isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        ],
        token: {
          colorPrimary: isDark ? '#fff' : '#000',
        },
        components: {
          Button: {
            controlHeightLG: 56,
          },
          Table: {
            ...antdTableTokens,
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider mode={isDark ? 'dark' : 'light'}>
          <TXPendingProvider>
            <TokenProvider>
              <ConnectModal />
              <SubmittedModal />
              <WalletDetailModal />
              {children}
              <div className="w-full max-md:h-[100px] md:h-[50px]" />
              <ChainBlockHeight />
            </TokenProvider>
          </TXPendingProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

const App = () => {
  const { locale, messages } = useLocale();

  return (
    <WagmiProvider config={config}>
      <ThemeProvider attribute="data-theme">
        <IntlProvider
          locale={locale}
          messages={messages}
          fallbackOnEmptyString
          defaultLocale="en-US"
        >
          <Dapp locale={locale}>
            <HashRouter>
              <Routes />
            </HashRouter>
          </Dapp>
        </IntlProvider>
      </ThemeProvider>
    </WagmiProvider>
  );
};
export default App;
