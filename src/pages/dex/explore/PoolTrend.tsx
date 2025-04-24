import MagicCard from '@/components/MagicCard';
import { useTranslate } from '@/i18n';
import { Recently } from '@/types/explore';
import { formatCurrency } from '@/utils';
import { Select, Skeleton } from 'antd';
import { formatUnits } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { times } from './times';
import { getPairVOL, getPairTVL } from '@/services/explore';
import { useMutation } from '@tanstack/react-query';
import VolumeBar from './charts/VolumeBar';
import TVLLinear from './charts/TVLLinear';

const TypeSelector = ({
  onChange,
  value,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const { t } = useTranslate();
  const options = [
    {
      value: 'tvl',
      label: t('common.tvl'),
    },
    {
      value: 'vol',
      label: t('common.volume'),
    },
  ];
  return (
    <Select
      className="w-[100px]"
      options={options}
      value={value}
      onChange={(e) => {
        onChange(e);
      }}
    />
  );
};

const DateSelector = ({
  value,
  onChange,
}: {
  value: Recently;
  onChange: (v: Recently) => void;
}) => {
  return (
    <Select
      className="w-[60px]"
      options={times}
      value={value}
      onChange={(e) => {
        onChange(e);
      }}
    />
  );
};

const VOL = ({
  onTypeChange,
  address,
}: {
  onTypeChange: (type: string) => void;
  address: string;
}) => {
  const { t } = useTranslate();
  const [recently, setRecently] = useState<Recently>(Recently.day);

  const {
    data: vols,
    mutate: getVols,
    isPending,
  } = useMutation({
    mutationFn: getPairVOL,
  });

  useEffect(() => {
    if (recently) {
      getVols({ recently, token: address });
    }
  }, [recently]);

  const total = useMemo(() => {
    if (vols?.items.length) {
      return formatCurrency(
        Number(formatUnits(vols?.items[vols?.items.length - 1]?.amount || 0n)),
        false,
        0
      );
    }
    return 0;
  }, [vols]);

  return (
    <MagicCard>
      <div className="flex flex-col py-[16px]">
        <div className="flex-center-between">
          <span className="text-[16px] text-tc-secondary">
            {t('common.volume')}
          </span>
          <div className="flex gap-[5px]">
            <TypeSelector value="vol" onChange={onTypeChange} />
            <DateSelector
              value={recently}
              onChange={(e) => {
                setRecently(e);
              }}
            />
          </div>
        </div>
        <div className="mt-[10px] flex h-[420px] flex-col">
          <span className="text-[28px] font-[500]">${total}</span>
          <div className="flex-1 pt-[20px]">
            {isPending ? (
              <Skeleton />
            ) : (
              <VolumeBar recently={recently} data={vols?.items || []} />
            )}
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

const TVL = ({
  onTypeChange,
  address,
}: {
  onTypeChange: (type: string) => void;
  address: string;
}) => {
  const { t } = useTranslate();
  const [recently, setRecently] = useState<Recently>(Recently.day);

  const {
    data: tvls,
    mutate: getTVL,
    isPending,
  } = useMutation({
    mutationFn: getPairTVL,
  });

  useEffect(() => {
    if (recently) {
      getTVL({ recently, token: address });
    }
  }, [recently]);

  const total = useMemo(() => {
    if (tvls?.items.length) {
      return formatCurrency(
        Number(formatUnits(tvls?.items[tvls?.items.length - 1]?.amount || 0n)),
        false,
        0
      );
    }
    return 0;
  }, [tvls]);

  return (
    <MagicCard>
      <div className="flex flex-col py-[16px]">
        <div className="flex-center-between">
          <span className="text-[16px] text-tc-secondary">
            {t('common.tvl')}
          </span>
          <div className="flex gap-[5px]">
            <TypeSelector value="tvl" onChange={onTypeChange} />
            <DateSelector
              value={recently}
              onChange={(e) => {
                setRecently(e);
              }}
            />
          </div>
        </div>
        <div className="mt-[10px] flex min-h-[420px] flex-col">
          <span className="text-[28px] font-[500]">${total}</span>
          <div className="flex-1 pt-[20px]">
            {isPending ? (
              <Skeleton />
            ) : (
              <TVLLinear data={tvls?.items || []} recently={recently} />
            )}
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

const PoolTrade = ({ address }: { address: string }) => {
  const [trendType, setTrendType] = useState<'tvl' | 'vol' | string>('tvl');

  if (trendType === 'tvl') {
    return <TVL onTypeChange={setTrendType} address={address} />;
  }

  return <VOL onTypeChange={setTrendType} address={address} />;
};

export default PoolTrade;
