import LendingCard from '@/components/LendingCard.tsx';
import TotalSupplyPie from '@/pages/lending/market/charts/TotalSupplyPie.tsx';
import DepositAPYLine from '@/pages/lending/market/charts/DepositAPYLine.tsx';
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { LendingAsset, LendingAssetInterest } from '@/types/Lending.ts';
import { useTranslate } from '@/i18n';
import { ListType } from '@/types/common';
import { Skeleton } from 'antd';
import { formatLargeNumber } from '@/utils';
import { useMemo } from 'react';

const TokenSupplyInfo = ({
  asset,
  interests,
  loading,
  licensed,
}: {
  licensed?: any;
  asset?: LendingAsset;
  loading?: boolean;
  interests?: ListType<LendingAssetInterest>;
}) => {
  const { t } = useTranslate();
  const maxLendingAmount = useMemo(() => {
    if (!asset) return '-';
    return formatLargeNumber(
      Number(asset?.lendingAmount) / (Number(asset?.max_ltv) / 10000)
    );
  }, [asset]);

  const maxLendingPrice = useMemo(() => {
    if (!asset?.unitPrice) return '-';
    return formatLargeNumber(
      (Number(asset?.lendingAmount) / (Number(asset?.max_ltv) / 10000)) *
        asset?.unitPrice
    );
  }, [asset]);

  const maxDepositPrice = useMemo(() => {
    if (!asset?.unitPrice) return '-';
    return formatLargeNumber(Number(asset?.depositAmount) * asset?.unitPrice);
  }, [asset]);

  const maxDepositAmount = useMemo(() => {
    if (!asset) return '-';
    return formatLargeNumber(Number(asset?.depositAmount));
  }, [asset]);

  const percent = useMemo(() => {
    if (asset?.lendingAmount) {
      return Number(
        (
          (Number(asset?.lendingAmount) /
            (Number(asset?.max_ltv) / 10000) /
            Number(asset?.depositAmount) || 1) * 100
        ).toFixed(1)
      );
    }
  }, [asset]);

  return (
    <LendingCard
      title={t('lending.market.detail.supply.info')}
      collapsible={false}
    >
      <div className="w-full px-[6px] py-[16px]">
        <div className="flex w-full justify-between">
          <div className="flex h-[90px] w-full gap-[10px]">
            <div className="flex h-full max-w-[300px] flex-1 items-center gap-[10px] rounded-[8px] border border-line-primary">
              <TotalSupplyPie percent={percent || 0} />
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                  <span>{t('lending.market.supplied')}</span>
                  <ExclamationCircleOutlined />
                </div>
                <span className="text-[16px] font-[500]">
                  {maxLendingAmount} / {maxDepositAmount}
                </span>
                <span className="text-[12px] text-tc-secondary">
                  ${maxLendingPrice} / ${maxDepositPrice}
                </span>
              </div>
            </div>
            <div className="flex h-full  w-[130px] flex-col items-start justify-center gap-[5px] rounded-[8px] border border-line-primary pl-[10px]">
              <span className="text-[14px] text-tc-secondary">
                {t('lending.apy')}
              </span>
              <span className="text-[14px] font-[500]">
                {asset?.depositInterest || 0}%
              </span>
            </div>
          </div>
        </div>
        <div className="relative h-[180px] py-[20px]">
          <span className="text-[14px] font-[500]">
            {t('lending.market.detail.supply.apr')}
          </span>
          {loading ? (
            <div>
              <Skeleton />
            </div>
          ) : (
            <DepositAPYLine data={interests?.items || []} />
          )}
        </div>
        <div className="mt-[40px]">
          <div className="flex-center-between">
            <span className="text-[14px] font-[500]">
              {t('lending.market.detail.supply.collateral.usage')}
            </span>
            <div className="flex items-center gap-[5px] text-[14px] text-theme">
              <CheckCircleFilled />
              <span>{t('lending.market.detail.supply.can.be.collateral')}</span>
            </div>
          </div>
          <div className="mt-[10px] flex h-[65px] gap-[10px]">
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>{t('lending.market.detail.supply.max.ltv')}</span>
                <ExclamationCircleOutlined />
              </div>
              <span className="text-[14px] font-[500]">
                {licensed?.maximumLTV || 0}%
              </span>
            </div>
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>{t('lending.health.liquidation.threshold')}</span>
                <ExclamationCircleOutlined />
              </div>
              <span className="text-[14px] font-[500]">
                {licensed?.bestLendingRatio || 0}%
              </span>
            </div>
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>
                  {t('lending.market.detail.supply.liquidation.penalty')}
                </span>
                <ExclamationCircleOutlined />
              </div>
              <span className="text-[14px] font-[500]">
                {licensed?.liquidationPenalty || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </LendingCard>
  );
};

export default TokenSupplyInfo;
