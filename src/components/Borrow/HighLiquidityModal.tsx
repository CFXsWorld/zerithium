import { Button, Modal } from 'antd';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import Warning from '@/components/Warning.tsx';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { ZERO_ADDRESS } from '@/contracts';
import { Abi, Address } from 'viem';
import { BorrowModeType } from '@/types/slc.ts';
import { useTranslate } from '@/i18n';

const HighLiquidityModal = ({
  open,
  onClose,
  onSuccess,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contact: {
    abi: Abi;
    address: Address;
  };
}) => {
  const { writeContractAsync, isSubmittedLoading, loading } = useXWriteContract(
    {
      onWriteSuccess: onSuccess,
    }
  );

  const enableMode = async () => {
    const { address, abi } = contact;
    writeContractAsync({
      address: address,
      abi,
      functionName: 'userModeSetting',
      args: [BorrowModeType.HighLiquidity, ZERO_ADDRESS],
    });
  };

  const { t } = useTranslate();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('lending.borrow.mode.enable')}
      footer={null}
      centered
      maskClosable={false}
    >
      <div>
        <div className="flex flex-col gap-[10px] p-[16px]">
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('lending.borrow.mode.category')}
            </span>
            <span>{t('lending.borrow.mode.high.title')}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('lending.borrow.mode.high.all')}
            </span>
            <span>{`${t('lending.borrow.mode.high.all.assets')} > ${t('lending.borrow.mode.high.all.assets')}`}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('lending.health.factor')}
            </span>
            <div className="flex flex-col items-end justify-end gap-[10px]">
              <div className="flex-center gap-[10px]">
                <HealthFactor value={'1000'} />
                <span className="text-[12px] text-tc-secondary">{`->`}</span>
                <HealthFactor value={'1000'} />
              </div>
              <div className="text-[12px] text-tc-secondary">
                <span>{`${t('lending.borrow.mode.high.health')} < 1.0`}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Warning>{t('lending.borrow.mode.high.detail')}</Warning>
        </div>
        <div className="mt-[20px] h-[56px]  w-full">
          <WithAuthButton>
            <Button
              className="w-full"
              type="primary"
              size="large"
              onClick={enableMode}
              loading={isSubmittedLoading || loading}
            >
              {t('lending.borrow.mode.enable')}
            </Button>
          </WithAuthButton>
        </div>
      </div>
    </Modal>
  );
};

export default HighLiquidityModal;
