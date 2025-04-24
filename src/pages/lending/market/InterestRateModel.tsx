import LendingCard from '@/components/LendingCard.tsx';
import InterestRateLine from '@/pages/lending/market/charts/InterestRateLine.tsx';
import { useTranslate } from '@/i18n';
import { useState } from 'react';
import { LendingAsset } from '@/types/Lending';

const InterestRateModel = ({
  asset,
  mode,
}: {
  asset?: LendingAsset;
  mode: number;
}) => {
  const { t } = useTranslate();
  const [UTRate, onUTRateChange] = useState('0');
  return (
    <LendingCard
      title={t('lending.market.detail.interest.rate.model')}
      collapsible={false}
    >
      <div className="px-[6px] py-[16px]">
        <div className="mb-[20px] flex flex-col gap-[5px]">
          <span className="text-[14px] text-tc-secondary">
            {t('lending.market.detail.utilization')}
          </span>
          <span className="text-[16px] font-[500] ">{UTRate}%</span>
        </div>
        <div className="flex gap-[40px]">
          <div className="flex items-center gap-[10px]">
            <div className="h-[10px] w-[10px] rounded-full bg-theme" />
            <span className="text-[16px] font-[500]">
              {t('lending.market.supply.variable')}
            </span>
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="h-[10px] w-[10px] rounded-full bg-[#E65D5D]" />
            <span className="text-[16px] font-[500]">
              {t('lending.market.borrow.variable')}
            </span>
          </div>
        </div>
        <InterestRateLine
          onUTRateChange={onUTRateChange}
          mode={mode}
          asset={asset}
        />
      </div>
    </LendingCard>
  );
};

export default InterestRateModel;
