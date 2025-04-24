import { BuySellIcon, BorrowIcon } from '@/components/icons';
import RouteTabs from '@/components/RouteTabs.tsx';
import useMintSLC from '@/pages/x-super-libra-coin/hooks/useMintSLC.ts';
import SecondTabs from '@/pages/x-super-libra-coin/mint/SecondTabs.tsx';
import TokenInput from '@/components/TokenInput.tsx';
import { ArrowDownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SwapInfo from '@/pages/x-super-libra-coin/mint/SwapInfo.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button } from 'antd';
import useWalletAuth from '@/components/Wallet/useWalletAuth.ts';
import useApprove from '@/pages/x-dex/hooks/useApprove.ts';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { Address } from 'viem';
import useNativeToken from '@/hooks/useNativeToken.ts';
import Tip from '@/pages/x-super-libra-coin/burn/Tip.tsx';
import { useTranslate } from '@/i18n';

function MintSLC() {
  const {
    inputToken,
    setInputToken,
    outputToken,
    payAmount,
    setPayAmount,
    receiveAmount,
    setReceiveAmount,
    inputOwnerAmount,
    outputOwnerAmount,
    outputTokenTotalPrice,
    inputTokenTotalPrice,
    fromPairUnit,
    isInsufficient,
    isReady,
    isInsufficientLiquidity,
    isSubmittedLoading,
    onConfirm,
  } = useMintSLC();

  const {
    isApproved: isTokenAApproved,
    loading: isTokenAApproving,
    approve: approveTokenA,
  } = useApprove({
    token: inputToken!,
    amount: payAmount,
    spenderAddress: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
  });

  const { t } = useTranslate();

  const { isNativeToken } = useNativeToken();

  const { disabled } = useWalletAuth();

  const renderSwapText = () => {
    if (!inputToken?.address) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('x-dex.swap.token.modal.title')}
        </Button>
      );
    }
    if (isInsufficient) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('common.error.insufficient', { name: `${inputToken?.symbol} ` })}
        </Button>
      );
    }
    if (isInsufficientLiquidity) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('common.error.insufficient.liquidity')}
        </Button>
      );
    }
    if (!isTokenAApproved && !isNativeToken(inputToken) && isReady) {
      return (
        <Button
          className="w-full"
          type="primary"
          size="large"
          disabled={isTokenAApproved}
          icon={isTokenAApproved ? <CheckCircleOutlined /> : null}
          loading={isTokenAApproving}
          onClick={approveTokenA}
        >
          {isTokenAApproved
            ? t('common.approved', { name: `${inputToken?.symbol}` })
            : t('common.approve.to', { name: `${inputToken?.symbol}` })}
        </Button>
      );
    }
    return (
      <Button
        className="w-full"
        type="primary"
        size="large"
        disabled={!isReady || isInsufficient || isInsufficientLiquidity}
        onClick={onConfirm}
        loading={isSubmittedLoading}
      >
        {t('common.mint')}
      </Button>
    );
  };
  return (
    <div className="flex flex-1 flex-col items-center justify-center pt-[40px] max-md:px-[10px] max-md:pt-[40px]">
      <RouteTabs
        tabs={[
          {
            name: 'Buy',
            path: '/x-super-libra-coin/mint',
            icon: <BuySellIcon />,
            label: t('x-super-libra-coin.title'),
          },
          {
            name: 'Borrow',
            path: '/x-super-libra-coin/borrow',
            icon: <BorrowIcon />,
            label: t('x-lending.borrow'),
          },
        ]}
        active="Buy"
      />
      <Tip />
      <div className="mt-[30px] min-h-[420px] w-[500px]  rounded-[20px] bg-fill-niubi p-[20px] max-md:w-full">
        <div className="flex items-center justify-between ">
          <SecondTabs active="Mint" />
        </div>
        <div className="mt-[20px]">
          <TokenInput
            editable
            title={t('x-dex.swap.input.pay')}
            token={inputToken}
            onTokenChange={setInputToken}
            amount={payAmount}
            onAmountChange={setPayAmount}
            disabledToken={outputToken}
            disabled={disabled}
            onMax={(ownerAmount) => {
              setPayAmount(ownerAmount.toString());
            }}
            ownerAmount={inputOwnerAmount}
            totalPrice={inputTokenTotalPrice}
          />
          <div className="relative h-[20px]">
            <div className="flex-center  absolute left-[50%]  top-[-8px] h-[36px] w-[36px] -translate-x-[50%] transform rounded-[2px] border-[3px] border-line-primary2 bg-background-primary">
              <ArrowDownOutlined />
            </div>
          </div>
          <TokenInput
            title={t('x-dex.swap.input.receive')}
            editable
            token={outputToken}
            onTokenChange={() => {}}
            amount={receiveAmount}
            onAmountChange={setReceiveAmount}
            disabled
            ownerAmount={outputOwnerAmount}
            totalPrice={outputTokenTotalPrice}
            showDropArrow={false}
          />
        </div>
        {isReady && (
          <div className="px-[10px] py-[20px] text-[14px]">
            <SwapInfo
              inputToken={inputToken}
              outputToken={outputToken}
              fromPairUnit={fromPairUnit}
            />
          </div>
        )}

        <div className="mt-[20px] h-[56px]  w-full">
          <WithAuthButton>{renderSwapText()}</WithAuthButton>
        </div>
      </div>
    </div>
  );
}

export default MintSLC;
