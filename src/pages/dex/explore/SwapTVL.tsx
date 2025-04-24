import MagicCard from '@/components/MagicCard.tsx';
import TimePicker from '@/components/TimePicker.tsx';
import { times } from '@/pages/dex/explore/times.ts';
import TVLLinear from '@/pages/dex/explore/charts/TVLLinear.tsx';
import { useTranslate } from '@/i18n';
import { Recently, TokenTVL } from '@/types/explore';
import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'ethers';
import { formatCurrency } from '@/utils';

const SwapTVL = ({
  data,
  getData,
}: {
  data: TokenTVL[];
  getData: (params: { recently?: Recently }) => void;
}) => {
  const { t } = useTranslate();
  const [recently, setRecently] = useState<Recently | undefined>(Recently.day);
  useEffect(() => {
    getData({ recently });
  }, [recently]);

  const total = useMemo(() => {
    if (data?.length) {
      return formatCurrency(
        Number(formatUnits(data[data.length - 1]?.amount || 0n)),
        false,
        0
      );
    }
    return 0;
  }, [data]);

  return (
    <MagicCard>
      <div className="flex flex-col py-[16px]">
        <div className="flex-center-between">
          <span className="text-[16px] text-tc-secondary">
            {t('common.tvl')}
          </span>
          <TimePicker
            options={times}
            onTimeChange={(v) => {
              setRecently(v as Recently);
            }}
            time={recently as string}
          />
        </div>
        <div className="mt-[10px] flex flex-col">
          <span className="text-[28px] font-[500]">${total}</span>
          <div>
            <TVLLinear data={data} recently={recently} />
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

export default SwapTVL;
