import AmountCard from '@/components/AmountCard.tsx';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PoolList from '@/pages/dex/pools/PoolList.tsx';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@/i18n';
import PoolFilter from './PoolFilter';
import { useEffect, useState } from 'react';
import MyPoolList from './MyPoolList';
import { useMutation } from '@tanstack/react-query';
import { getAllPoolInfo } from '@/services/pool';
import { formatUnits } from 'ethers';
import { formatCurrency } from '@/utils';

function Pools() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [poolType, setPoolType] = useState('0');
  const onPoolChange = (type: string) => {
    setPoolType(type);
  };

  const { data, mutate } = useMutation({
    mutationFn: getAllPoolInfo,
  });
  useEffect(() => {
    mutate();
  }, []);

  return (
    <div className="mt-[30px] flex  min-h-[420px]  flex-col items-center p-[20px] max-md:mt-0 max-md:p-[16px] max-md:pb-[80px]">
      <div className="w-full max-md:mx-0 max-md:w-[calc(100%)] md:max-w-[1200px]">
        <div className="flex-center-between pb-[32px]">
          <span className="text-[24px] font-bold">{t('dex.pools.title')}</span>
          <Button
            icon={<PlusOutlined />}
            className="rounded-[20px]"
            type="primary"
            onClick={() => {
              navigate('/dex/create-pool');
            }}
          >
            {t('dex.pools.create')}
          </Button>
        </div>
        <div className=" flex w-full flex-wrap items-center gap-[30px] max-md:flex-col">
          <AmountCard
            title={t('common.tvl')}
            amount={String(
              formatCurrency(Number(formatUnits(data?.tvl || 0n)), false, 0)
            )}
            loading={false}
            className="w-auto flex-1"
          />
          <AmountCard
            title={t('dex.pools.volume.24H')}
            amount={String(
              formatCurrency(
                Number(formatUnits(data?.volume24h || 0n)),
                false,
                0
              )
            )}
            loading={false}
            className="w-auto flex-1"
          />
        </div>
        <div>
          <PoolFilter poolType={poolType} onPoolChange={onPoolChange} />
          {poolType === '0' ? <PoolList /> : <MyPoolList />}
        </div>
      </div>
    </div>
  );
}

export default Pools;
