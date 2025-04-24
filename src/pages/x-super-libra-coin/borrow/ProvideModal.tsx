import { Button, Modal } from 'antd';
import TokenInput from '@/components/TokenInput.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { SLCAsset } from '@/types/slc.ts';
import useProvide from '@/pages/x-super-libra-coin/hooks/useProvide.ts';
import useApprove from '@/pages/x-dex/hooks/useApprove.ts';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { Address } from 'viem';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslate } from '@/i18n';

const ProvideModal = ({
  open,
  onClose,
  asset,
  refresh,
}: {
  open: boolean;
  onClose: () => void;
  asset?: SLCAsset;
  refresh: () => void;
}) => {
  const {
    provide,
    inputToken,
    payAmount,
    setPayAmount,
    isInsufficient,
    inputOwnerAmount,
    isSubmittedLoading,
    loading,
    inputTokenTotalPrice,
  } = useProvide({ token: asset, refresh });
  const { t } = useTranslate();
  const {
    isApproved: isTokenAApproved,
    loading: isTokenAApproving,
    approve: approveTokenA,
  } = useApprove({
    token: inputToken!,
    amount: payAmount,
    spenderAddress: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
  });

  const { isNativeToken } = useNativeToken();
  const renderSwapText = () => {
    if (isInsufficient && payAmount) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('common.error.insufficient', { name: `${asset?.symbol}` })}
        </Button>
      );
    }

    if (!isTokenAApproved && !isNativeToken(inputToken!) && payAmount) {
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
          {t('x-dex.swap.give.permission', { name: `${inputToken?.symbol}` })}
        </Button>
      );
    }
    return (
      <Button
        className="w-full"
        type="primary"
        size="large"
        disabled={!payAmount || isInsufficient}
        onClick={provide}
        loading={isSubmittedLoading || loading}
      >
        {t('x-super-libra-coin.provide.to', { name: `${asset?.symbol}` })}
      </Button>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('x-super-libra-coin.provide.to', { name: `${asset?.symbol}` })}
      footer={null}
      centered
      maskClosable={false}
    >
      <div>
        <div className="mt-[20px]">
          <TokenInput
            editable
            title={t('x-lending.borrow.input.amount')}
            token={inputToken}
            onTokenChange={() => {}}
            amount={payAmount}
            onAmountChange={setPayAmount}
            disabled
            ownerAmount={inputOwnerAmount}
            totalPrice={inputTokenTotalPrice}
            amountLabel={t('x-super-libra-coin.provided')}
            showDropArrow={false}
          />
        </div>
        <div className="mt-[20px] h-[56px]  w-full">
          <WithAuthButton>{renderSwapText()}</WithAuthButton>
        </div>
      </div>
    </Modal>
  );
};

export default ProvideModal;
