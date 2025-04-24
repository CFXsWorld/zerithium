import { ColumnType } from 'antd/es/table';
import { formatCurrency } from '@/utils';
import { PoolType } from '@/types/pool.ts';
import { formatUnits } from 'ethers';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import { Skeleton } from 'antd';
import { useTranslate } from '@/i18n';
import { useMutation } from '@tanstack/react-query';
import { getTokenPairs } from '@/services/explore';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TokenIcon } from '@/components/icons';

const PoolList = () => {
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const { data, mutate, isPending } = useMutation({
    mutationFn: getTokenPairs,
  });
  useEffect(() => {
    if (tokenAddress) {
      mutate({ token: tokenAddress });
    }
  }, [tokenAddress]);

  const { t } = useTranslate();

  const columns: ColumnType<PoolType>[] = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex  gap-[10px]">
            <span className="flex">
              <TokenIcon
                src={record.tokenA.icon}
                width={20}
                height={20}
                name={record.tokenA.symbol}
              />
              <TokenIcon
                src={record.tokenB.icon}
                width={20}
                height={20}
                className="ml-[-5px]"
                name={record.tokenB.symbol}
              />
            </span>
            <span>{`${record.tokenA.symbol} / ${record.tokenB.symbol}`}</span>
          </div>
        );
      },
    },

    {
      title: t('common.tvl'),
      dataIndex: 'tvl',
      align: 'center',
      render: (value: string) => (
        <div className="flex flex-col gap-[5px]">
          {formatCurrency(Number(formatUnits(value || 0n)), true)}
        </div>
      ),
    },
    {
      title: t('common.volume24h'),
      dataIndex: 'volume24h',
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(Number(formatUnits(record?.volume24h || 0n)), true)}
          </div>
        );
      },
    },
    {
      title: t('common.volume1W'),
      dataIndex: 'volume1w',
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(Number(formatUnits(record?.volume1w || 0n)), true)}
          </div>
        );
      },
    },
    {
      title: t('common.fees24h'),
      dataIndex: 'volume24h',
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(
              Number(formatUnits(record?.volume24h || 0n)) *
                (Number(record?.fees || 0) / 10000),
              true
            )}
          </div>
        );
      },
    },
    {
      title: t('common.APR24h'),
      dataIndex: 'volume24h',
      render: (_: string, record: PoolType) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {(
              ((365 *
                Number(formatUnits(record?.volume24h || 0n)) *
                (Number(record?.fees || 0) / 10000)) /
                (Number(formatUnits(record?.tvl || 0n)) || 1)) *
              100
            ).toFixed(2)}
            %
          </div>
        );
      },
    },
  ];
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="min-h-[400px] bg-fill-niubi p-[10px]">
        {isPending ? (
          <div className="p-[24px]">
            <Skeleton active />
          </div>
        ) : (
          <ResponsiveTable
            columns={columns}
            dataSource={data?.items || []}
            rowKey="id"
          />
        )}
      </div>
    </div>
  );
};

export default PoolList;
