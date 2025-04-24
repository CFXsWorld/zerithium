import Swap from '../swap/Swap';
import { cn } from '@/utils/classnames';
import { useTranslate } from '@/i18n';
import TokenList from './TokenTradeList';
import LiquidityList from './TokenLiquidityList';
import useExploreToken from '../hooks/useExploreToken';
import { Spin } from 'antd';
import TokenTrade from './TokenTrend';
import {
  LeftOutlined,
  FundViewOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import TokenWithIcon from '@/components/TokenWithIcon';
import { maskAddress4 } from '@/utils';
import { useCopy } from '@/hooks/useCopy';

function TokenDetail() {
  const { t } = useTranslate();
  const {
    loading,
    navigate,
    listType,
    setListType,
    receiveToken,
    tokenAddress,
  } = useExploreToken();
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
            {receiveToken && (
              <div className="flex gap-[10px]">
                <TokenWithIcon
                  token={receiveToken!}
                  className="text-[16px] font-bold"
                />
                <span
                  className="mx-[5px] flex cursor-pointer items-center gap-[5px] hover:text-theme"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(receiveToken?.address);
                  }}
                >
                  {maskAddress4(receiveToken?.address)} <CopyOutlined />
                </span>

                <FundViewOutlined
                  className="cursor-pointer hover:text-theme"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(receiveToken?.address);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full gap-[20px] max-md:flex-col">
          <div className="flex-1">
            <TokenTrade address={tokenAddress! || ''} />
          </div>
          <Spin spinning={!!loading}>
            <Swap
              receiveToken={receiveToken}
              onReceiveChange={(token) => {
                if (token) {
                  navigate(`/dex/explore/token/${token.address}`);
                }
              }}
            />
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
            {listType === 'trade' && <TokenList />}
            {listType === 'liquidity' && <LiquidityList />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenDetail;
