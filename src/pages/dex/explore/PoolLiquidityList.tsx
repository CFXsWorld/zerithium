import { ColumnType } from 'antd/es/table';
import { formatCurrency, maskAddress4 } from '@/utils';
import { formatUnits } from 'ethers';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import { Skeleton } from 'antd';
import { useTranslate } from '@/i18n';
import { useMutation } from '@tanstack/react-query';
import { getPairActivity } from '@/services/explore';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TokenIcon } from '@/components/icons';
import { PairActivity } from '@/types/explore';
import { ActivityRecordType } from '@/types/activity';
import { formatNumber } from '@/hooks/useErc20Balance';

const PoolList = () => {
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const { data, mutate, isPending } = useMutation({
    mutationFn: getPairActivity,
  });
  useEffect(() => {
    if (tokenAddress) {
      mutate({ address: tokenAddress });
    }
  }, [tokenAddress]);

  const { t } = useTranslate();

  const columns: ColumnType<PairActivity>[] = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      render: (_: string, record: PairActivity) => {
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
      title: t('common.action'),
      dataIndex: 'type',
      align: 'center',
      render: (value: string) => {
        if (value === ActivityRecordType.ADD_LIQUIDITY) {
          return (
            <div className="flex flex-col gap-[5px]">{t('common.add')} </div>
          );
        }
        return (
          <div className="flex flex-col gap-[5px]">{t('common.remove')} </div>
        );
      },
    },
    {
      title: t('dex.swap.trade.amount'),
      dataIndex: 'amount',
      render: (_: string, record: PairActivity) => {
        return (
          <div className="flex flex-row items-center gap-[5px]">
            <span>
              {formatNumber(
                Number(formatUnits(record?.tokenA?.amount || 0n)),
                4
              )}
              /
              {formatNumber(
                Number(formatUnits(record?.tokenB?.amount || 0n)),
                4
              )}
            </span>
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
          </div>
        );
      },
    },
    {
      title: t('dex.swap.trade.total.price'),
      dataIndex: 'totalPrice',
      render: (_: string, record: PairActivity) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {formatCurrency(
              Number(formatUnits(record?.totalPrice || 0n)),
              true
            )}
          </div>
        );
      },
    },
    {
      title: t('dex.swap.trade.wallet.address'),
      dataIndex: 'sender',
      align: 'center',
      render: (_: string, record: PairActivity) => {
        return (
          <div className="flex flex-col gap-[5px]">
            {maskAddress4(record?.sender || '') || '--'}
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
            rowKey="time"
          />
        )}
      </div>
    </div>
  );
};

export default PoolList;
