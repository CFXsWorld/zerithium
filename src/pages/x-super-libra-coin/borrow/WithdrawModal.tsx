import { Button, Modal } from 'antd';
import TokenInput from '@/components/TokenInput.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import Warning from '@/components/Warning.tsx';
import { SLCAsset } from '@/types/slc.ts';
import useWithdraw from '@/pages/x-super-libra-coin/hooks/useWithdraw.ts';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { useTranslate } from '@/i18n';

const WithdrawModal = ({
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
    withdraw,
    inputToken,
    payAmount,
    setPayAmount,
    isInsufficient,
    isSubmittedLoading,
    loading,
    inputTokenTotalPrice,
    userHealthFactor,
    estimatedHealthFactor,
    remainingProvided,
  } = useWithdraw({ token: asset, refresh });
  const { t } = useTranslate();
  const renderSwapText = () => {
    if (isInsufficient && payAmount) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('common.error.insufficient.provided', {
            name: `${asset?.symbol}`,
          })}
        </Button>
      );
    }
    return (
      <Button
        className="w-full"
        type="primary"
        size="large"
        disabled={!payAmount || isInsufficient}
        onClick={withdraw}
        loading={isSubmittedLoading || loading}
      >
        {t('lending.withdraw.to', { name: `${asset?.symbol}` })}
      </Button>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('lending.withdraw.to', { name: `${asset?.symbol}` })}
      footer={null}
      centered
      maskClosable={false}
    >
      <div>
        <div className="mt-[20px]">
          <TokenInput
            editable
            title={t('lending.borrow.input.amount')}
            token={inputToken}
            onTokenChange={() => {}}
            amount={payAmount}
            onAmountChange={setPayAmount}
            disabled
            ownerAmount={asset?.provided || 0}
            totalPrice={inputTokenTotalPrice}
            amountLabel={t('x-super-libra-coin.provided')}
            showDropArrow={false}
          />
        </div>
        <div className="flex flex-col gap-[10px] p-[16px]">
          <div className="flex-center-between">
            <span className="text-tc-secondary">
              {t('lending.withdraw.remaining.provided')}
            </span>
            <span>
              {remainingProvided} {asset?.symbol}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('lending.health.factor')}
            </span>
            <div className="flex flex-col items-end justify-end gap-[10px]">
              <div className="flex-center gap-[10px]">
                <HealthFactor value={`${userHealthFactor}`} />
                <span className="text-[12px] text-tc-secondary">{`->`}</span>
                <HealthFactor
                  value={`${estimatedHealthFactor || userHealthFactor}`}
                />
              </div>
              <div className="text-[12px] text-tc-secondary">
                <span>{`${t('lending.borrow.mode.high.health')} < 1.0`}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Warning>{t('lending.withdraw.detail')}</Warning>
        </div>
        <div className="mt-[20px] h-[56px]  w-full">
          <WithAuthButton>{renderSwapText()}</WithAuthButton>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
