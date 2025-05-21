import { formatCurrency } from '@/utils';
import { LendingAsset } from '@/types/Lending.ts';
import { TokenIcon } from '@/components/icons';
import { Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { useTranslate } from '@/i18n';

const AssetInfo = ({ asset }: { asset?: LendingAsset }) => {
  const { t } = useTranslate();
  return (
    <div className="flex w-full items-center justify-around max-md:flex-wrap max-md:items-start">
      <div className="mr-[40px] flex h-[76px] min-w-[225px] items-center gap-[20px] border-[2px] border-transparent border-r-line-primary max-md:w-full max-md:items-start max-md:border-0">
        <div className="flex  items-center gap-[10px] max-md:items-start">
          <TokenIcon src={asset?.token.icon} width={50} height={50} />
          <div className="flex flex-col items-start gap-[10px] max-md:items-start">
            <span className="text-[16px] font-[500]">{`Wrapped ${asset?.token.name}`}</span>
            <div className="flex gap-[5px]">
              <span className="text-[14px] text-tc-secondary">{`${asset?.token.symbol}`}</span>
              {asset?.lending_mode_num === '1' && (
                <Tag color="error" className="flex gap-[3px]">
                  <span> {t('lending.market.risk.tip')}</span>
                  <ExclamationCircleOutlined />
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 max-md:flex-wrap">
        <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px] py-[12px] pr-[16px] max-md:min-w-[100px] max-md:flex-1">
          <span className="text-[16px] text-tc-secondary">
            {t('lending.market.detail.size')}
          </span>
          <span className="text-[20px] font-bold">
            {formatCurrency(formatNumber(asset?.depositAmount || 0, 6), false)}
          </span>
        </div>

        <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[100px] max-md:flex-1">
          <span className="text-[16px] text-tc-secondary">
            {t('lending.market.detail.available')}
          </span>
          <span className="text-[20px] font-bold">
            {formatCurrency(
              formatNumber(
                (asset?.depositAmount || 0) - (asset?.lendingAmount || 0),
                6
              ),
              false
            )}
          </span>
        </div>
        <div className="flex flex-1 justify-between max-md:justify-start">
          <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px]  max-md:min-w-[100px] max-md:flex-1">
            <span className="text-[16px] text-tc-secondary">
              {t('lending.market.detail.utilization')}
            </span>
            <span className="text-[20px] font-bold">
              {formatNumber(
                (asset?.lendingAmount || 0) / (asset?.depositAmount || 1),
                4
              )}
            </span>
          </div>
          <div className="flex h-[84px] flex-col items-end max-md:min-w-[100px] max-md:flex-1 max-md:items-start">
            <span className="flex h-[52px] items-center justify-end text-tc-secondary">
              {t('lending.market.detail.oracle')}
            </span>
            <span className="text-[20px] font-bold">
              {formatCurrency(formatNumber(asset?.oraclePrice || 0, 6), false)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssetInfo;
