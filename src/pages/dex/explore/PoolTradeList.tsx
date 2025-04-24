import { ColumnType } from 'antd/es/table';
import { maskAddress4 } from '@/utils';
import { formatUnits } from 'ethers';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import { Skeleton } from 'antd';
import { useTranslate } from '@/i18n';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { TokenTrade } from '@/types/explore';
import { useParams } from 'react-router-dom';
import { getPairTradeList } from '@/services/explore';
import { formatNumber } from '@/hooks/useErc20Balance';
import dayjs from 'dayjs';
import TokenWithIcon from '@/components/TokenWithIcon';
import { RightCircleTwoTone } from '@ant-design/icons';
const TokenList = () => {
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const {
    data: tradeList,
    mutate: getTradeData,
    isPending,
  } = useMutation({
    mutationFn: getPairTradeList,
  });

  useEffect(() => {
    if (tokenAddress) {
      getTradeData({ address: tokenAddress });
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
      title: t('dex.swap.title'),
      dataIndex: 'amount',
      align: 'center',
      render: (_: string, record: TokenTrade) => {
        return (
          <div className="flex flex-col items-center gap-[5px]">
            <div className="flex justify-start max-md:flex-col max-md:justify-end">
              <span className="flex  items-start gap-[10px] max-md:justify-end">
                <span className=" text-right">
                  {formatNumber(
                    Number(formatUnits(record?.pay.amount || 0n)),
                    5
                  )}
                </span>
                <TokenWithIcon token={record?.pay.token} />
              </span>
              <span className="w-[100px] text-center max-md:py-[10px] max-md:text-right">
                <RightCircleTwoTone className="text-theme-non-opaque" />
              </span>
              <span className="flex items-start gap-[10px]">
                <span className="text-right">
                  {formatNumber(
                    Number(formatUnits(record?.received.amount || 0n)),
                    5
                  )}
                </span>
                <TokenWithIcon token={record?.received.token} />
              </span>
            </div>
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
      <div className="min-h-[400px] bg-fill-niubi p-[10px] ">
        {isPending ? (
          <div className="p-[24px]">
            <Skeleton active />
          </div>
        ) : (
          <ResponsiveTable
            columns={columns}
            dataSource={tradeList?.items || []}
            rowKey="time"
          />
        )}
      </div>
    </div>
  );
};

export default TokenList;
