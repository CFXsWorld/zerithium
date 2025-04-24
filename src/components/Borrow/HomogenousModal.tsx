import { Button, Modal } from 'antd';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import Warning from '@/components/Warning.tsx';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { useState } from 'react';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { Abi, Address } from 'viem';
import TokenGroupSelector from '@/components/Borrow/TokenGroupSelector.tsx';
import { LendingAsset } from '@/types/Lending.ts';
import { ZERO_ADDRESS } from '@/contracts';
import { useTranslate } from '@/i18n';

const HomogenousModal = ({
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
  const [assets, setAssets] = useState<LendingAsset[]>();

  const { writeContractAsync, isSubmittedLoading, loading } = useXWriteContract(
    {
      onWriteSuccess: onSuccess,
    }
  );

  const enableMode = async () => {
    if (assets?.length) {
      const { address, abi } = contact;
      const mode = assets[0].lending_mode_num;
      writeContractAsync({
        address: address,
        abi,
        functionName: 'userModeSetting',
        args: [mode, ZERO_ADDRESS],
      });
    }
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
        <TokenGroupSelector value={assets} onChange={setAssets} />
        <div className="flex flex-col gap-[10px] p-[16px]">
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('lending.borrow.mode.category')}
            </span>
            <span>{t('lending.borrow.mode.homogenous.title')}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-tc-secondary">
              {t('lending.borrow.mode.high.all')}
            </span>
            <div className="text-[12px]">
              {assets?.map((asset, index) => (
                <span key={asset.id}>
                  <span>{asset.token.symbol}</span>
                  {index !== assets?.length - 1 && (
                    <span className="px-[5px]">/</span>
                  )}
                </span>
              ))}
            </div>
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
                <span>{`Liquidation at < 1.0`}</span>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-between">
            {/*<span className="text-tc-secondary">Maximum loan to value</span>*/}
            {/*<span>{`-- > ${token ? (token?.max_ltv ? Number(token?.max_ltv) / 100 : 0) : '--'}%`}</span>*/}
          </div>
        </div>
        <div>
          <Warning>{t('lending.borrow.mode.homogenous.detail')}</Warning>
        </div>
        <div className="mt-[20px] h-[56px]  w-full">
          <WithAuthButton>
            <Button
              className="w-full"
              type="primary"
              size="large"
              disabled={!assets?.length}
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

export default HomogenousModal;
