import { TokenIcon } from '@/components/icons';
import TokenWithIcon from '@/components/TokenWithIcon';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { useCopy } from '@/hooks/useCopy';
import { formatNumber } from '@/hooks/useErc20Balance';
import { useTranslate } from '@/i18n';
import { PoolType } from '@/types/pool';
import { Token } from '@/types/swap';
import { formatCurrency, maskAddress4 } from '@/utils';
import { CopyOutlined, FundViewOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { formatUnits } from 'ethers';
import { useMemo } from 'react';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';

const AddressInfo = ({ address }: { address: string }) => {
  const { copy } = useCopy();
  return (
    <div className="flex items-center gap-[10px]">
      <span
        className="mx-[5px] flex cursor-pointer items-center gap-[5px] rounded-[5px] bg-fill-secondary px-[4px] py-[4px] hover:text-theme"
        onClick={(e) => {
          e.stopPropagation();
          copy(address);
        }}
      >
        {maskAddress4(address)} <CopyOutlined />
      </span>

      <FundViewOutlined
        className="cursor-pointer hover:text-theme"
        onClick={(e) => {
          e.stopPropagation();
          copy(address);
        }}
      />
    </div>
  );
};

const PoolInfo = ({ pool }: { pool?: PoolType }) => {
  const { t } = useTranslate();

  const { data: info } = useReadContract({
    address: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SWAP_CONTRACT.interface.abi,
    functionName: 'getLpReserve',
    args: [pool?.pairToken?.address || ''],
    query: {
      enabled: !!pool?.pairToken?.address,
    },
  });

  const tokenA = useMemo(() => {
    if (info && pool) {
      return {
        ...pool?.tokenA,
        amount: formatNumber(
          Number(formatUnits((info as bigint[][])[0][0]) || 0n),
          4
        ),
      };
    }
  }, [pool, info]);

  const tokenB = useMemo(() => {
    if (info && pool) {
      return {
        ...pool?.tokenB,
        amount: formatNumber(
          Number(formatUnits((info as bigint[][])[0][1]) || 0n),
          4
        ),
      };
    }
  }, [pool, info]);
  const percent = useMemo(() => {
    if (tokenA && tokenB) {
      return (
        (Number(tokenA.amount || 0) /
          (Number(tokenA.amount || 0) + Number(tokenB.amount || 0))) *
        100
      ).toFixed(2);
    }
    return 0;
  }, [tokenA, tokenB]);

  return (
    <div className="h-[420px] w-[500px]  rounded-[20px] bg-fill-niubi p-[20px] max-md:w-full">
      <div className="text-tc-secondary">{t('dex.liquidity.title')}</div>
      <div>
        <Progress
          percent={Number(percent)}
          showInfo={false}
          strokeColor={'#6e5de6'}
          trailColor={percent ? '#F7931A' : undefined}
        />
        <div className="mt-[10px] flex justify-between">
          <div>
            {tokenA && (
              <span className="flex gap-[10px]">
                {tokenA?.amount || 0}
                <TokenWithIcon token={tokenA as Token} />
              </span>
            )}
          </div>
          <div>
            {tokenB && (
              <span className="flex gap-[10px]">
                {tokenB?.amount || 0}
                <TokenWithIcon token={tokenB as Token} />
              </span>
            )}
          </div>
        </div>

        <div className="mt-[30px] flex">
          <div className="flex flex-1 flex-col">
            <span className="text-tc-secondary">{t('common.tvl')}</span>
            <span className="mt-[10px] text-[18px]">
              {formatCurrency(Number(formatUnits(pool?.tvl || 0n)), true)}
            </span>
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-tc-secondary">{t('common.volume24h')}</span>
            <span className="mt-[10px] text-[18px]">
              {formatCurrency(Number(formatUnits(pool?.volume24h || 0n)), true)}
            </span>
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-tc-secondary">{t('common.fees24h')}</span>
            <span className="mt-[10px] text-[18px]">
              {formatCurrency(
                Number(formatUnits(pool?.volume24h || 0n)) *
                  (Number(pool?.fees || 0) / 10000),
                true
              )}
            </span>
          </div>
        </div>
        <div className="mt-[20px] text-tc-secondary">
          {t('dex.swap.token.info')}
        </div>

        {pool && (
          <div className="mt-[20px] flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <div className="flex  gap-[10px]">
                <span className="flex">
                  <TokenIcon
                    src={pool?.tokenA.icon}
                    width={20}
                    height={20}
                    name={pool?.tokenA.symbol}
                  />
                  <TokenIcon
                    src={pool?.tokenB.icon}
                    width={20}
                    height={20}
                    className="ml-[-5px]"
                    name={pool?.tokenB.symbol}
                  />
                </span>
                <span>{`${pool?.tokenA.symbol} / ${pool?.tokenB.symbol}`}</span>
              </div>
              <AddressInfo address={pool?.pairToken?.address} />
            </div>
            <div className="flex items-center justify-between">
              <TokenWithIcon token={pool?.tokenA} />
              <AddressInfo address={pool?.tokenA?.address} />
            </div>
            <div className="flex items-center justify-between">
              <TokenWithIcon token={pool?.tokenB as Token} />
              <AddressInfo address={pool?.tokenB?.address} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolInfo;
