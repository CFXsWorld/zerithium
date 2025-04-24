import LendingCard from '@/components/LendingCard.tsx';
import BorrowAPYLine from '@/pages/lending/market/charts/BorrowAPYLine';
import { ExclamationCircleOutlined, FundViewOutlined } from '@ant-design/icons';
import { LendingAsset, LendingAssetInterest } from '@/types/Lending.ts';
import { Button, Skeleton } from 'antd';
import { useTranslate } from '@/i18n';
import { ListType } from '@/types/common';
import { Link } from 'react-router-dom';
import { confluxScan } from '@/components/notices/usePendingNotice';
import { ZERITHIUM_LENDING_CONTRACT } from '@/contracts';
import { useMemo } from 'react';
import { formatLargeNumber } from '@/utils';

const TokenBorrowInfo = ({
  asset,
  loading,
  interests,
  normalFloorOfHealthFactor,
}: {
  asset?: LendingAsset;
  loading?: boolean;
  interests?: ListType<LendingAssetInterest>;
  normalFloorOfHealthFactor?: number;
}) => {
  const { t } = useTranslate();

  const maxLendingAmount = useMemo(() => {
    if (!asset) return '-';
    return formatLargeNumber(Number(asset?.lendingAmount));
  }, [asset]);

  const maxDepositUsedAmount = useMemo(() => {
    if (!asset || !normalFloorOfHealthFactor) return '-';
    return formatLargeNumber(
      (Number(asset?.depositAmount) * (Number(asset?.max_ltv) / 10000)) /
        normalFloorOfHealthFactor
    );
  }, [asset, normalFloorOfHealthFactor]);

  const maxLendingPrice = useMemo(() => {
    if (!asset?.unitPrice) return '-';
    return formatLargeNumber(Number(asset?.lendingAmount) * asset?.unitPrice);
  }, [asset]);

  const maxDepositPrice = useMemo(() => {
    if (!asset?.unitPrice || !normalFloorOfHealthFactor) return '-';
    return formatLargeNumber(
      ((Number(asset?.depositAmount) * (Number(asset?.max_ltv) / 10000)) /
        normalFloorOfHealthFactor) *
        asset?.unitPrice
    );
  }, [asset, normalFloorOfHealthFactor]);

  return (
    <LendingCard
      title={t('lending.market.detail.borrow.info')}
      collapsible={false}
    >
      <div className="w-full px-[6px] py-[16px]">
        <div className="flex w-full justify-between">
          <div className="flex h-[90px] w-full gap-[10px]">
            <div className="flex h-full max-w-[300px] flex-1   items-center gap-[10px] rounded-[8px] border border-line-primary p-[10px]">
              <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                  <span>{t('lending.market.borrow')}</span>
                  <ExclamationCircleOutlined />
                </div>
                <span className="text-[16px] font-[500]">
                  {maxLendingAmount} / {maxDepositUsedAmount}
                </span>
                <span className="text-[12px] text-tc-secondary">
                  ${maxLendingPrice} / ${maxDepositPrice}
                </span>
              </div>
            </div>
            <div className="flex h-full  w-[130px] flex-col items-start justify-center gap-[5px] rounded-[8px] border border-line-primary pl-[10px]">
              <span className="text-[14px] text-tc-secondary">
                {t('lending.market.detail.borrow.cap')}
              </span>
              <span className="text-[14px] font-[500]">
                {maxDepositUsedAmount}
              </span>
              <span className="text-[12px] text-tc-secondary">
                ${maxDepositPrice}
              </span>
            </div>
            <div className="flex h-full  w-[130px] flex-col items-start justify-center gap-[5px] rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>{t('lending.market.detail.borrow.apy.variable')}</span>
                <ExclamationCircleOutlined />
              </div>
              <span className="text-[14px] font-[500]">
                {asset?.lendingInterest || 0}%
              </span>
            </div>
          </div>
        </div>
        <div className="h-[180px] py-[20px]">
          <span className="text-[14px] font-[500]">
            {t('lending.market.borrow.variable')}
          </span>
          {loading ? (
            <div>
              <Skeleton />
            </div>
          ) : (
            <BorrowAPYLine data={interests?.items || []} />
          )}
        </div>
        <div className="mt-[40px]">
          <div className="flex-center-between">
            <span className="text-[14px] font-[500]">
              {t('lending.market.detail.borrow.collector.info')}
            </span>
          </div>
          <div className="mt-[10px] flex h-[65px] gap-[10px]">
            <div className="flex h-full   flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>{t('lending.market.detail.borrow.reserve.factor')}</span>
                <ExclamationCircleOutlined />
              </div>
              <span className="text-[14px] font-[500]">{5}%</span>
            </div>
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>
                  {t('lending.market.detail.borrow.min.accessible.hf')}
                </span>
              </div>
              <span className="text-[14px] font-[500]">
                {normalFloorOfHealthFactor}
              </span>
            </div>
            <div className="flex h-full  flex-1 flex-col items-start justify-center  rounded-[8px] border border-line-primary pl-[10px]">
              <div className="flex gap-[5px] text-[14px] text-tc-secondary">
                <span>
                  {t('lending.market.detail.borrow.collector.contract')}
                </span>
              </div>
              <Link
                to={`${confluxScan}address/${ZERITHIUM_LENDING_CONTRACT.interface.address}`}
                target="_blank"
              >
                <Button
                  size="small"
                  type="text"
                  className="text-[14px] text-tc-secondary"
                >
                  <span> {t('common.view')}</span>
                  <FundViewOutlined />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LendingCard>
  );
};

export default TokenBorrowInfo;
