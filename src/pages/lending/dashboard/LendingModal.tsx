import { Button, Modal } from 'antd';
import TokenInput from '@/components/TokenInput.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import Warning from '@/components/Warning.tsx';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import useLending from '@/pages/lending/hooks/useLending.ts';
import { LendingAsset } from '@/types/Lending.ts';
import { useTranslate } from '@/i18n';

const LendingModal = ({
  asset,
  onClose,
  refresh,
  userHealthFactor,
}: {
  asset: LendingAsset;
  onClose: () => void;
  refresh: () => void;
  userHealthFactor: number;
}) => {
  const {
    inputToken,
    payAmount,
    setPayAmount,
    inputTokenTotalPrice,
    isInsufficient,
    isReady,
    isSubmittedLoading,
    onConfirm,
    healthFactor,
    loading,
    availableAmount,
  } = useLending({ refresh, asset });
  const { t } = useTranslate();

  const renderSwapText = () => {
    if (isInsufficient) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('lending.supply.available.amount', {
            amount: `${asset.availableAmount}`,
          })}
        </Button>
      );
    }

    return (
      <Button
        className="w-full"
        type="primary"
        size="large"
        disabled={!isReady || isInsufficient || loading}
        onClick={onConfirm}
        loading={isSubmittedLoading || loading}
      >
        {t('lending.borrow.to', { name: `${asset.token.symbol}` })}
      </Button>
    );
  };

  return (
    <Modal
      open={!!asset}
      onCancel={onClose}
      title={t('lending.borrow.to', { name: `${asset.token.symbol}` })}
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
            ownerAmount={formatNumber(availableAmount || 0, 6)}
            totalPrice={inputTokenTotalPrice}
            amountLabel={t('lending.available')}
            showDropArrow={false}
          />
        </div>
        <div className="flex flex-col gap-[10px] p-[16px]">
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('lending.health.factor')}
            </span>
            <div className="flex flex-col items-end justify-end gap-[10px]">
              <div className="flex-center gap-[10px]">
                <HealthFactor value={`${userHealthFactor || 0}`} />
                <span className="text-[12px] text-tc-secondary">{`->`}</span>
                <HealthFactor
                  value={
                    healthFactor?.healthFactor || `${userHealthFactor || 0}`
                  }
                />
              </div>
              <div className="text-[12px] text-tc-secondary">
                <span>{`${t('lending.borrow.mode.high.health')} < 1.0`}</span>
              </div>
            </div>
          </div>
          <div className="flex-center-between">
            <span className="text-tc-secondary">
              {t('lending.market.supply.apy')}
            </span>
            <span>
              {asset?.depositInterest}%
              <span className="px-[10px] text-[12px] text-tc-secondary">{`->`}</span>{' '}
              {healthFactor?.supplyInterest || '--'}
            </span>
          </div>
          <div className="flex-center-between">
            <span className="text-tc-secondary">
              {t('lending.market.borrow.apy')}
            </span>
            <span>
              {asset?.lendingInterest}%
              <span className="px-[10px] text-[12px] text-tc-secondary">{`->`}</span>
              {healthFactor?.borrowInterest || '--'}
            </span>
          </div>
        </div>
        <div>
          <Warning>{t('lending.borrow.detail')}</Warning>
        </div>
        <div className="mt-[20px] h-[56px]  w-full">
          <WithAuthButton>{renderSwapText()}</WithAuthButton>
        </div>
      </div>
    </Modal>
  );
};

export default LendingModal;
