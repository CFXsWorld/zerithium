import useWalletStore from '@/store/wallet.ts';
import { maskAddress4 } from '@/utils';
import useWalletAuth from '@/components/Wallet/useWalletAuth.ts';
import { ConnectKitButton } from 'connectkit';
import { AvatarIcon } from '@/components/icons';
import { useSwitchChain } from 'wagmi';

const ConnectButton = () => {
  const onDetailOpen = useWalletStore((state) => state.onDetailOpen);
  const { CHAIN_ID } = useWalletAuth();
  const { switchChain } = useSwitchChain();

  return (
    <ConnectKitButton.Custom>
      {({ chain, isConnected, address, show }) => {
        const connected = isConnected && address;
        const isErrorNetwork = connected && chain?.id !== CHAIN_ID;

        if (isErrorNetwork) {
          return (
            <div
              className="flex h-[40px] cursor-pointer items-center justify-center rounded-[16px] bg-status-error-non-opaque px-[16px] text-status-error"
              onClick={() => {
                switchChain({ chainId: CHAIN_ID });
              }}
            >
              Switch Network
            </div>
          );
        }

        if (connected && !isErrorNetwork) {
          return (
            <div
              className="flex h-[40px] cursor-pointer items-center justify-center gap-[12px] rounded-[16px] bg-fill-e-primary px-[16px] text-tc-primary"
              onClick={() => {
                onDetailOpen(true);
              }}
            >
              <AvatarIcon className="text-[30px]" />
              <span>{maskAddress4(address)}</span>
            </div>
          );
        }

        return (
          <div
            className="flex h-[40px] cursor-pointer items-center justify-center rounded-[16px] border border-theme bg-theme-non-opaque px-[16px] text-theme"
            onClick={show}
          >
            Connect Wallet
          </div>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

export default ConnectButton;
