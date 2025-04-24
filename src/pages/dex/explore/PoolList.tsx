import { ColumnType } from 'antd/es/table';
import { formatCurrency } from '@/utils';
import { EyeOutlined } from '@ant-design/icons';
import usePool from '@/pages/dex/hooks/usePool.ts';
import { PoolType } from '@/types/pool.ts';
import { formatUnits } from 'ethers';
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import { Button, Skeleton } from 'antd';
import { useTranslate } from '@/i18n';
import { cn } from '@/utils/classnames';
import { TokenIcon } from '@/components/icons';

const PoolList = () => {
  const { pools, isPending } = usePool();

  const { t } = useTranslate();
  const navigate = useNavigate();

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
    {
      dataIndex: 'action',
      render: (_: string, record) => {
        return (
          <Button
            type="text"
            ghost
            onClick={() => {
              navigate(`/dex/explore/pool/${record.pairToken.address}`);
            }}
            icon={<EyeOutlined />}
          />
        );
      },
    },
  ];
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex w-full  justify-between gap-[20px]">
        <div className="flex items-center gap-[20px]">
          <Link
            to={'/dex/explore/token'}
            className={cn(
              'flex-center h-[40px] cursor-pointer gap-[12px] rounded-[20px] px-[16px] hover:bg-theme-non-opaque hover:text-theme  '
            )}
          >
            <span className="max-md:text-[14px]">{t('dex.swap.token')}</span>
          </Link>
          <Link
            to={'/dex/explore/pool'}
            className={cn(
              'flex-center pointer-events-none h-[40px] gap-[12px] rounded-[20px] bg-theme-non-opaque px-[16px] text-theme '
            )}
          >
            <span className="max-md:text-[14px]">{t('dex.swap.pool')}</span>
          </Link>
        </div>
      </div>
      <div className="min-h-[400px]  bg-fill-niubi p-[10px]">
        {isPending ? (
          <div className="p-[24px]">
            <Skeleton active />
          </div>
        ) : (
          <ResponsiveTable columns={columns} dataSource={pools} rowKey="id" />
        )}
      </div>
    </div>
  );
};

export default PoolList;
