import { ColumnType } from 'antd/es/table';
import { formatCurrency, maskAddress4 } from '@/utils';
import { formatUnits } from 'ethers';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import { Skeleton } from 'antd';
import { useTranslate } from '@/i18n';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { TokenTrade } from '@/types/explore';
import { cn } from '@/utils/classnames';
import { useParams } from 'react-router-dom';
import { getTokenTradeList } from '@/services/explore';
import TokenWithIcon from '@/components/TokenWithIcon';
import { formatNumber } from '@/hooks/useErc20Balance';
import dayjs from 'dayjs';

const getTargetToken = (address: string, record: TokenTrade) => {
  if (
    record?.pay?.token?.address.toLowerCase() === address.toLocaleLowerCase()
  ) {
    return {
      ...record?.pay,
      type: 'sell',
      pair: record?.received,
    };
  }
  return {
    ...record?.received,
    type: 'buy',
    pair: record?.pay,
  };
};

const TokenList = () => {
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const {
    data: tradeList,
    mutate: getTradeData,
    isPending,
  } = useMutation({
    mutationFn: getTokenTradeList,
  });

  useEffect(() => {
    if (tokenAddress) {
      getTradeData({ address: tokenAddress, pageNum: 1, pageSize: 30 });
    }
  }, [tokenAddress]);

  const { t } = useTranslate();
  const columns: ColumnType<TokenTrade>[] = [
    {
      title: t('dex.swap.trade.time'),
      dataIndex: 'time',
      render: (v) => dayjs.unix(v).format('MM-DD HH:mm:ss'),
    },
    {
      title: t('dex.swap.trade.amount'),
      dataIndex: 'amount',
      render: (_: string, record: TokenTrade) => {
        const target = getTargetToken(tokenAddress!, record);
        return (
          <div className="flex flex-col gap-[5px]">
            {formatNumber(Number(formatUnits(target.amount || 0n)), 5)}
          </div>
        );
      },
    },
    {
      title: t('dex.swap.trade.side'),
      align: 'center',
      dataIndex: 'side',
      render: (_, record: TokenTrade) => {
        const target = getTargetToken(tokenAddress!, record);
        if (target.type === 'sell') {
          return (
            <div className={cn('text-status-error')}>
              {t('dex.swap.trade.sell')}
            </div>
          );
        }
        return (
          <div className={cn('text-status-success')}>
            {t('dex.swap.trade.buy')}
          </div>
        );
      },
    },
    {
      title: t('dex.swap.trade.pair'),
      dataIndex: 'pair',
      align: 'right',
      render: (_: string, record: TokenTrade) => {
        const target = getTargetToken(tokenAddress!, record);
        return (
          <div className="flex  items-center justify-end gap-[5px]">
            <span className="flex">
              {formatNumber(Number(formatUnits(target.pair.amount || 0n)), 5)}
            </span>
            <span className="flex">
              <TokenWithIcon token={target?.pair?.token} />
            </span>
          </div>
        );
      },
    },
    {
      title: t('dex.swap.trade.total.price'),
      dataIndex: 'price',
      align: 'center',
      render: (_: string, record: TokenTrade) => {
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
      render: (_: string, record: TokenTrade) => {
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
      <div className="min-h-[400px]  bg-fill-niubi p-[10px] ">
        {isPending ? (
          <div className="p-[24px]">
            <Skeleton active />
          </div>
        ) : (
          <ResponsiveTable
            columns={columns}
            dataSource={tradeList?.items || []}
            rowKey="id"
          />
        )}
      </div>
    </div>
  );
};

export default TokenList;
