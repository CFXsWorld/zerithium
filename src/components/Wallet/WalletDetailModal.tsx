import useWalletStore from '@/store/wallet.ts';
import { AvatarIcon } from '@/components/icons';
import { useAccount, useDisconnect } from 'wagmi';
import { usePersistStore } from '@/store/persist.ts';
import { maskAddress4 } from '@/utils';
import { CopyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useCopy } from '@/hooks/useCopy.ts';
import DrawerContainer from '@/components/DrawerContainer.tsx';
import useWalletDetail from '@/components/Wallet/useWalletDetail.ts';
import TokenList from '@/components/Wallet/TokenList.tsx';

const WalletDetailModal = () => {
  const open = useWalletStore((state) => state.detailOpen);
  const onOpen = useWalletStore((state) => state.onDetailOpen);
  const { disconnectAsync } = useDisconnect();
  const updateWallet = usePersistStore((state) => state.updateWallet);
  const { address } = useAccount();
  const { copy } = useCopy();
  const { tokens, loading, isTokenLoading, totalPrice } = useWalletDetail();

  return (
    address && (
      <DrawerContainer
        open={open}
        onClose={() => {
          onOpen(false);
        }}
      >
        <div className="h-full max-md:h-[60vh] max-md:overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-[10px]">
              <div className="relative h-[40px] w-[40px]">
                <AvatarIcon className="text-[40px]" />
              </div>
              <span className="flex items-center gap-[10px]">
                {maskAddress4(address)}
                <CopyOutlined
                  className="cursor-pointer hover:text-theme"
                  onClick={() => {
                    copy(address);
                  }}
                />
              </span>
            </div>
            <LogoutOutlined
              className="cursor-pointer text-[20px] hover:text-theme"
              onClick={() => {
                disconnectAsync().then(() => {
                  onOpen(false);
                  updateWallet(null);
                });
              }}
            />
          </div>

          <div className="mt-[20px] flex flex-col gap-[16px]">
            <div className="line-clamp-1 py-[10px] text-[24px] font-bold">
              {totalPrice}
            </div>

            <TokenList tokens={tokens} loading={loading || isTokenLoading} />
          </div>
        </div>
      </DrawerContainer>
    )
  );
};

export default WalletDetailModal;
