import LendingCard from '@/components/LendingCard.tsx';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { LendingAsset } from '@/types/Lending.ts';
import { useTranslate } from '@/i18n';
import { useMemo } from 'react';

const HomogenousInfo = ({
  asset,
  licensed,
  homoFloorOfHealthFactor,
}: {
  licensed?: any;
  asset?: LendingAsset;
  homoFloorOfHealthFactor?: number;
}) => {
  const { t } = useTranslate();

  const maxLTV = useMemo(() => {
    if (asset?.homogeneous_mode_ltv) {
      return Number(asset?.homogeneous_mode_ltv) / 100;
    }
    return 0;
  }, [asset]);
  return (
    <LendingCard
      title={t('lending.borrow.mode')}
      collapsible={false}
      className="min-h-[60px]"
    >
      <div className="w-full px-[6px] py-[16px]">
        <div className="mt-[10px]">
          <div className="mb-[5px] flex flex-col gap-[10px]">
            <span className="text-[14px] font-[500]">
              {t('lending.borrow.mode.homogenous.title')}
            </span>
            <span className="text-[12px] text-tc-secondary">
              {t('lending.borrow.mode.homogenous.description')}
            </span>
          </div>
          <div className="mt-[10px] flex h-[65px] gap-[10px]">
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>{t('lending.market.detail.supply.max.ltv')}</span>
                <ExclamationCircleOutlined />
              </div>
              <span className="text-[14px] font-[500]">{maxLTV}%</span>
            </div>
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>
                  {t('lending.market.detail.borrow.min.accessible.hf')}
                </span>
              </div>
              <span className="text-[14px] font-[500]">
                {homoFloorOfHealthFactor}
              </span>
            </div>
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>
                  {t('lending.market.detail.supply.liquidation.penalty')}
                </span>
                <ExclamationCircleOutlined />
              </div>
              <span className="text-[14px] font-[500]">
                {licensed?.liquidationPenalty || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </LendingCard>
  );
};

export default HomogenousInfo;
