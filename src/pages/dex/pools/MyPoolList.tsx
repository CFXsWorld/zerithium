import { ColumnType } from 'antd/es/table';
import { SwapIcon, TokenIcon } from '@/components/icons';
import { formatCurrency } from '@/utils';
import {
  EllipsisOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Popover, Skeleton } from 'antd';
import { PoolType } from '@/types/pool.ts';
import { formatUnits } from 'ethers';
import { useNavigate } from 'react-router-dom';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import ResponsiveButton from '@/components/ResponsiveButton.tsx';
import { useTranslate } from '@/i18n';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getWalletPools } from '@/services/pool';
import { useAccount } from 'wagmi';
import { formatNumber } from '@/hooks/useErc20Balance';
import useMulticall, { ContractCall } from '@/hooks/useMulticall';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';

const PoolList = () => {
  const navigate = useNavigate();
  const { multiCall } = useMulticall();
  const { t } = useTranslate();
  const { address } = useAccount();
  const [pools, setPools] = useState<PoolType[]>([]);

  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: getWalletPools,
  });
  useEffect(() => {
    if (address) {
      mutateAsync({ pageNum: 1, pageSize: 100, address }).then(async (res) => {
        if (res?.items.length) {
          const calls: ContractCall[] = res?.items.map((pool) => ({
            name: 'getUserCoinOrLpAmount',
            abi: ZERITHIUM_SWAP_CONTRACT.interface.abi,
            address: ZERITHIUM_SWAP_CONTRACT.interface.address,
            values: [pool?.pairToken?.address, address],
          }));

          multiCall(calls).then(async (amounts) => {
            const newData = [];
            for (let index = 0; index < res?.items.length; index++) {
              const pool = res?.items[index];
              newData.push({
                ...pool,
                pairToken: {
                  ...pool.pairToken,
                  amount: amounts.returnData[index],
                },
              });
            }
            setPools(newData);
          });
        }
      });
    }
  }, [address]);

  const total = data?.total || 0;

  const columns: ColumnType<PoolType>[] = [
    {
      title: t('common.name'),
      dataIndex: 'tokenA',
      width: 240,
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
      width: 240,
      render: (value: string) => (
        <div className="flex flex-col gap-[5px]">
          {formatCurrency(Number(formatUnits(value || 0n)), true)}
        </div>
      ),
    },
    {
      title: t('dex.swap.trade.amount'),
      dataIndex: 'amount',
      width: 240,
      render: (_: string, record) => (
        <div className="flex flex-col gap-[5px]">
          {formatNumber(Number(formatUnits(record.pairToken?.amount || 0n)), 5)}
        </div>
      ),
    },
    {
      title: t('common.volume24h'),
      dataIndex: 'volume24h',
      width: 240,
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
      render: (_: string, record: PoolType) => {
        const Buttons = (
          <div className="flex  flex-col gap-[5px] max-md:flex-row max-md:flex-wrap">
            <ResponsiveButton
              className="md:text-left md:text-primary"
              onClick={() => {
                navigate(
                  `/dex/liquidity?tokena=${record.tokenA.address}&tokenb=${record.tokenB.address}`
                );
              }}
              icon={<PlusOutlined />}
            >
              {t('dex.liquidity.add')}
            </ResponsiveButton>
            <ResponsiveButton
              className="md:text-left md:text-primary"
              onClick={() => {
                navigate(`/dex/liquidity/remove/${record?.pairToken?.address}`);
              }}
              icon={<DeleteOutlined />}
            >
              {t('dex.liquidity.remove')}
            </ResponsiveButton>
            <ResponsiveButton
              className="md:text-left md:text-primary"
              onClick={() => {
                navigate(
                  `/dex/swap?tokena=${record.tokenA.address}&tokenb=${record.tokenB.address}`
                );
              }}
              icon={<SwapIcon />}
            >
              {t('dex.swap.title')}
            </ResponsiveButton>
          </div>
        );
        return (
          <>
            <div className="md:hidden">{Buttons}</div>
            <div className="max-md:hidden">
              <Popover title={Buttons} trigger={['click']}>
                <EllipsisOutlined className="cursor-pointer text-[20px]" />
              </Popover>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="bg-fill-niubi">
        <div className="flex-center-between p-[15px]">
          <div className="flex-center gap-[5px]">
            <span className="text-[18px] font-bold">
              {t('dex.pools.label')}
            </span>
            <span className="text-tc-secondary">{`(${total})`}</span>
          </div>
        </div>
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
