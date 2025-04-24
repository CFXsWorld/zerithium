import { Button, Checkbox, Modal } from 'antd';
import TokenInput from '@/components/TokenInput.tsx';
import { CheckCircleOutlined } from '@ant-design/icons';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import useApprove from '@/pages/x-dex/hooks/useApprove.ts';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { Address } from 'viem';
import Warning from '@/components/Warning.tsx';
import { formatCurrency } from '@/utils';
import useRepaySLC from '@/pages/x-super-libra-coin/hooks/useRepaySLC.ts';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { isNumeric } from '@/utils/isNumeric.ts';
import { useTranslate } from '@/i18n';
import { TokenIcon } from '@/components/icons';
import { cn } from '@/utils/classnames';

const RepaySLCModal = ({
  open,
  onClose,
  availableAmount,
  refresh,
  userHealthFactor,
}: {
  open: boolean;
  onClose: () => void;
  availableAmount: number;
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
    isRepayAll,
    onRepayAllChange,
  } = useRepaySLC({ availableAmount, refresh });

  const {
    isApproved: isTokenAApproved,
    loading: isTokenAApproving,
    approve: approveTokenA,
  } = useApprove({
    token: inputToken!,
    amount: payAmount,
    spenderAddress: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
    hf: isRepayAll ? 1.1 : 1.0001,
  });

  const { t } = useTranslate();
  const renderSwapText = () => {
    if (isInsufficient) {
      return (
        <Button className="w-full" type="primary" size="large" disabled>
          {t('x-lending.supply.available.amount', {
            amount: `${formatNumber(Number(availableAmount || 0), 6)}`,
          })}
        </Button>
      );
    }
    if (!isTokenAApproved && isReady) {
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
          {t('x-dex.swap.give.permission', { name: 'xUSD' })}
        </Button>
      );
    }
    return (
      <Button
        className="w-full"
        type="primary"
        size="large"
        disabled={!isReady || isInsufficient}
        onClick={onConfirm}
        loading={isSubmittedLoading || loading}
      >
        {t('x-lending.repay.to', { name: 'xUSD' })}
      </Button>
    );
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('x-lending.repay.to', { name: 'xUSD' })}
      footer={null}
      centered
      maskClosable={false}
    >
      <div>
        <div className="mt-[20px]">
          <div className="mb-[20px] flex justify-end">
            <Checkbox
              checked={isRepayAll}
              onChange={(e) => {
                onRepayAllChange(e.target.checked);
              }}
            >
              Repay all
            </Checkbox>
          </div>
          {!isRepayAll ? (
            <TokenInput
              editable
              title={t('x-lending.borrow.input.amount')}
              token={inputToken}
              onTokenChange={() => {}}
              amount={payAmount}
              onAmountChange={setPayAmount}
              disabled
              ownerAmount={formatNumber(availableAmount || 0, 6)}
              totalPrice={inputTokenTotalPrice}
              amountLabel={t('x-lending.available')}
              showDropArrow={false}
            />
          ) : (
            <div className="h-[124px] rounded-[8px] bg-background-primary p-[16px]">
              <div className="text-[14px] text-tc-secondary">
                {t('x-lending.borrow.input.amount')}
              </div>

              <div className="flex h-[48px] justify-around py-[5px]">
                <div className="flex-1">
                  <span className="w-full border-0 bg-transparent text-[30px] font-bold outline-0 focus:border-0 focus:bg-transparent ">
                    ≈ {formatNumber(Number(availableAmount), 6)}
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
        <div className="flex flex-col gap-[5px] p-[16px]">
          <div className="flex-center-between">
            <span className="text-tc-secondary">
              {t('x-lending.repay.remaining.debt')}
            </span>
            <div className="flex-center flex gap-[10px]">
              <span>{formatCurrency(availableAmount, false)} xUSD</span>
              <span>{`->`}</span>
              <span>
                {formatCurrency(
                  availableAmount -
                    Number(isNumeric(payAmount) ? payAmount : 0),
                  false
                )}{' '}
                xUSD
              </span>
            </div>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('x-lending.health.factor')}
            </span>
            <div className="flex flex-col items-end justify-end gap-[10px]">
              <div className="flex-center gap-[10px]">
                <HealthFactor value={`${userHealthFactor}` || '0'} />
                <span className="text-[12px] text-tc-secondary">{`>`}</span>
                <HealthFactor
                  value={healthFactor || `${userHealthFactor}` || '0'}
                />
              </div>
              <div className="text-[12px] text-tc-secondary">
                <span>{`${t('x-lending.borrow.mode.high.health')} < 1.0`}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Warning>{t('x-lending.repay.detail')}</Warning>
        </div>
        <div className="mt-[20px] h-[56px]  w-full">
          <WithAuthButton>{renderSwapText()}</WithAuthButton>
        </div>
      </div>
    </Modal>
  );
};

export default RepaySLCModal;
