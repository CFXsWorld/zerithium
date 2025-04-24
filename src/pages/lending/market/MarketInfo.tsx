import { formatCurrency } from '@/utils';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { useTranslate } from '@/i18n';

const MarketInfo = ({
  totalLendingSize,
  totalDepositSize,
  totalMarketSize,
}: {
  totalLendingSize: number;
  totalDepositSize: number;
  totalMarketSize: number;
}) => {
  const { t } = useTranslate();
  return (
    <div className="flex items-center justify-start">
      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px] py-[12px] pr-[16px]">
        <span className="text-[16px] text-tc-secondary">
          {t('lending.market.size')}
        </span>
        <span className="text-[20px] font-bold">
          {formatCurrency(formatNumber(totalMarketSize, 6), true, 0)}
        </span>
      </div>

      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px]  ">
        <span className="text-[16px] text-tc-secondary">
          {t('lending.market.available')}
        </span>
        <span className="text-[20px] font-bold">
          {formatCurrency(formatNumber(totalDepositSize, 6), true, 0)}
        </span>
      </div>
      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px]  ">
        <span className="text-[16px] text-tc-secondary">
          {t('lending.market.borrow')}
        </span>
        <span className="text-[20px] font-bold">
          {formatCurrency(formatNumber(totalLendingSize, 6), true, 0)}
        </span>
      </div>
    </div>
  );
};
export default MarketInfo;
