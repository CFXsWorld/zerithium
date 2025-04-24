import { ColumnType } from 'antd/es/table';
import { formatCurrency } from '@/utils';
import { EyeOutlined } from '@ant-design/icons';
import { formatUnits } from 'ethers';
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import { Button, Skeleton } from 'antd';
import TokenWithIcon from '@/components/TokenWithIcon.tsx';
import { useTranslate } from '@/i18n';
import { useMutation } from '@tanstack/react-query';
import { getTokenList } from '@/services/token';
import { useEffect } from 'react';
import { Token } from '@/types/swap';
import { cn } from '@/utils/classnames';
import { formatNumber } from '@/hooks/useErc20Balance';

const TokenList = () => {
  const {
    data: tokens,
    mutate: getTokens,
    isPending,
  } = useMutation({
    mutationFn: getTokenList,
  });

  useEffect(() => {
    getTokens({ pageNum: 1, pageSize: 100 });
  }, []);

  const { t } = useTranslate();
  const navigate = useNavigate();
  const columns: ColumnType<Token>[] = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      render: (_: string, record: Token) => {
        return <TokenWithIcon token={record} />;
      },
    },
    {
      title: t('common.price'),
      dataIndex: 'tvl',
      render: (_: string, record: Token) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(Number(formatUnits(record?.price || 0n)), true)}
          </div>
        );
      },
    },
    {
      title: t('common.change24H'),
      align: 'center',
      dataIndex: 'volume24h',
      render: (_, record: Token) => {
        const price = Number(formatUnits(record?.price || 0n));
        const price24ago = Number(formatUnits(record?.price24ago || 0n));
        const rate = ((price - price24ago) / price24ago) * 100;
        if (rate > 0) {
          return (
            <div className={cn('flex flex-col gap-[5px] text-status-success')}>
              +{formatNumber(rate, 5)}%
            </div>
          );
        }
        if (rate < 0) {
          return (
            <div className={cn('flex flex-col gap-[5px] text-status-error')}>
              {formatNumber(rate, 5)}%
            </div>
          );
        }
        return (
          <div className={cn('gap-[5px flex flex-col')}>
            {formatNumber(rate, 5)}%
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
      render: (_: string, record: Token) => {
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
      render: (_: string, record: Token) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(Number(formatUnits(record?.volume1w || 0n)), true)}
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
              navigate(`/dex/explore/token/${record.address}`);
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
              'flex-center pointer-events-none h-[40px] gap-[12px] rounded-[20px] bg-theme-non-opaque px-[16px] text-theme '
            )}
          >
            <span className="max-md:text-[14px]">{t('dex.swap.token')}</span>
          </Link>
          <Link
            to={'/dex/explore/pool'}
            className={cn(
              'flex-center h-[40px] cursor-pointer gap-[12px] rounded-[20px] px-[16px] hover:bg-theme-non-opaque hover:text-theme  '
            )}
          >
            <span className="max-md:text-[14px]">{t('dex.swap.pool')}</span>
          </Link>
        </div>
        <div className="">
          <Link to={'/dex/listing'}>
            <Button type="primary">Listing</Button>
          </Link>
        </div>
      </div>
      <div className="min-h-[400px] bg-fill-niubi p-[10px] ">
        {isPending ? (
          <div className="p-[24px]">
            <Skeleton active />
          </div>
        ) : (
          <ResponsiveTable
            columns={columns}
            dataSource={tokens?.items || []}
            rowKey="id"
          />
        )}
      </div>
    </div>
  );
};

export default TokenList;
