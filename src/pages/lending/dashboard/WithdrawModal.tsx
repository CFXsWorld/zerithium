import { Button, Checkbox, Modal } from 'antd';
import TokenInput from '@/components/TokenInput.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import Warning from '@/components/Warning.tsx';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { LendingAsset } from '@/types/Lending.ts';
import useWithdraw from '@/pages/lending/hooks/useWithdraw.ts';
import { useTranslate } from '@/i18n';
import { TokenIcon } from '@/components/icons';
import { cn } from '@/utils/classnames';
import { formatNumber } from '@/hooks/useErc20Balance';

const WithdrawModal = ({
  onClose,
  asset,
  refresh,
}: {
  onClose: () => void;
  asset: LendingAsset;
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
    isWithdrawAll,
    onWithdrawAllChange,
  } = useWithdraw({ asset, refresh });

  const { t } = useTranslate();
  const renderSwapText = () => {
    if (isInsufficient && payAmount) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('common.error.insufficient.provided', {
            name: `${inputToken?.symbol}`,
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
        {t('lending.withdraw.to', { name: `${inputToken?.symbol}` })}
      </Button>
    );
  };
  return (
    <Modal
      open={!!asset}
      onCancel={onClose}
      title={t('lending.withdraw.to', { name: `${inputToken?.symbol}` })}
      footer={null}
      centered
      maskClosable={false}
    >
      <div>
        <div className="mt-[20px]">
          <div className="mb-[20px] flex justify-end">
            <Checkbox
              checked={isWithdrawAll}
              onChange={(e) => {
                onWithdrawAllChange(e.target.checked);
              }}
            >
              Withdraw all
            </Checkbox>
          </div>
          {!isWithdrawAll ? (
            <TokenInput
              editable
              title={t('lending.borrow.input.amount')}
              token={inputToken}
              onTokenChange={() => {}}
              amount={payAmount}
              onAmountChange={setPayAmount}
              disabled
              ownerAmount={formatNumber(asset?.depositAmount || 0, 6)}
              totalPrice={formatNumber(inputTokenTotalPrice, 6)}
              amountLabel={t('x-super-libra-coin.provided')}
              showDropArrow={false}
            />
          ) : (
            <div className="h-[124px] rounded-[8px] bg-background-primary p-[16px]">
              <div className="text-[14px] text-tc-secondary">
                {t('lending.borrow.input.amount')}
              </div>

              <div className="flex h-[48px] justify-around py-[5px]">
                <div className="flex-1">
                  <span className="w-full border-0 bg-transparent text-[30px] font-bold outline-0 focus:border-0 focus:bg-transparent ">
                    ≈ {formatNumber(Number(payAmount || 0), 6)}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      'flex-center h-[40px] flex-shrink-0  gap-[5px] rounded-[20px] text-tc-secondary'
                    )}
                  >
                    <div className="flex-center gap-[5px]">
                      <span className="flex-center text-[22px]">
                        <TokenIcon
                          src={inputToken?.icon}
                          name={inputToken?.symbol}
                        />
                      </span>
                      <span className="text-[14px]">{inputToken?.symbol}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[10px] p-[16px]">
          <div className="flex-center-between">
            <span className="text-tc-secondary">
              {t('lending.withdraw.remaining.provided')}
            </span>
            <span>
              {remainingProvided} {inputToken?.symbol}
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
                  value={`${estimatedHealthFactor?.healthFactor || userHealthFactor}`}
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
              {estimatedHealthFactor?.supplyInterest || '--'}
            </span>
          </div>
          <div className="flex-center-between">
            <span className="text-tc-secondary">
              {t('lending.market.borrow.apy')}
            </span>
            <span>
              {asset?.lendingInterest}%
              <span className="px-[10px] text-[12px] text-tc-secondary">{`->`}</span>
              {estimatedHealthFactor?.borrowInterest || '--'}
            </span>
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
