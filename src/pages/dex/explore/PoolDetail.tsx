import { cn } from '@/utils/classnames';
import { useTranslate } from '@/i18n';
import PoolTradeList from './PoolTradeList';
import LiquidityList from './PoolLiquidityList';
import { Spin } from 'antd';
import {
  LeftOutlined,
  FundViewOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { maskAddress4 } from '@/utils';
import { useCopy } from '@/hooks/useCopy';
import useExplorePool from '../hooks/useExplorePool';
import { TokenIcon } from '@/components/icons';
import PoolInfo from './PoolInfo';
import PoolTrade from './PoolTrend';

function TokenDetail() {
  const { t } = useTranslate();
  const { isPending, navigate, pool, setListType, listType, pairAddress } =
    useExplorePool();
  const { copy } = useCopy();
  return (
    <div className="mt-[30px] flex  min-h-[420px]  w-full flex-col items-center p-[20px] max-md:mt-0 max-md:p-[16px] max-md:pb-[80px]">
      <div className="max-md:mx-0 max-md:w-[calc(100%)] md:min-w-[1200px]">
        <div className="gap-[10px] py-[20px] hover:opacity-75">
          <div className="flex cursor-pointer items-center justify-start">
            <LeftOutlined
              className="mr-[20px] text-[18px]"
              onClick={() => {
                navigate(-1);
              }}
            />
            {pairAddress && pool && (
              <div className="flex gap-[10px]">
                <div className="flex  gap-[10px]">
                  <span className="flex">
                    <TokenIcon
                      src={pool.tokenA.icon}
                      width={20}
                      height={20}
                      name={pool.tokenA.symbol}
                    />
                    <TokenIcon
                      src={pool.tokenB.icon}
                      width={20}
                      height={20}
                      className="ml-[-5px]"
                      name={pool.tokenB.symbol}
                    />
                  </span>
                  <span className="text-[16px] font-bold">
                    {`${pool.tokenA.symbol} / ${pool.tokenB.symbol}`}
                  </span>
                </div>
                <span
                  className="mx-[5px] flex cursor-pointer items-center gap-[5px] hover:text-theme"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(pairAddress);
                  }}
                >
                  {maskAddress4(pairAddress)} <CopyOutlined />
                </span>

                <FundViewOutlined
                  className="cursor-pointer hover:text-theme"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(pairAddress);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full gap-[20px] max-md:flex-col">
          <div className="min-h-[420px] flex-1">
            <PoolTrade address={pairAddress! || ''} />
          </div>
          <Spin spinning={!!isPending}>
            <PoolInfo pool={pool} />
          </Spin>
        </div>
        <div className="mt-[40px] flex flex-col gap-[20px]">
          <div className="flex items-center gap-[20px]">
            <div
              className={cn(
                'flex-center h-[40px] gap-[12px] rounded-[20px] px-[16px]',
                listType === 'trade'
                  ? 'pointer-events-none  bg-theme-non-opaque text-theme'
                  : 'cursor-pointer hover:bg-theme-non-opaque hover:text-theme'
              )}
              onClick={() => {
                setListType('trade');
              }}
            >
              <span className="max-md:text-[14px]">{t('dex.swap.trade')}</span>
            </div>
            <div
              onClick={() => {
                setListType('liquidity');
              }}
              className={cn(
                'flex-center h-[40px]  gap-[12px] rounded-[20px] px-[16px]  ',
                listType === 'liquidity'
                  ? 'pointer-events-none  bg-theme-non-opaque text-theme'
                  : 'cursor-pointer hover:bg-theme-non-opaque hover:text-theme'
              )}
            >
              <span className="max-md:text-[14px]">
                {t('dex.liquidity.title')}
              </span>
            </div>
          </div>
          <div>
            {listType === 'trade' && <PoolTradeList />}
            {listType === 'liquidity' && <LiquidityList />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenDetail;
