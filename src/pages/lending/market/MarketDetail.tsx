import useMarketDetail from '@/pages/lending/hooks/useMarketDetail.ts';
import AssetInfo from '@/pages/lending/market/AssetInfo.tsx';
import { LeftOutlined } from '@ant-design/icons';
import { CHAINS } from '@/contracts/chains.tsx';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from 'antd';
import TokenBorrowInfo from '@/pages/lending/market/TokenBorrowInfo.tsx';
import TokenSupplyInfo from '@/pages/lending/market/TokenSupplyInfo.tsx';
import InterestRateModel from '@/pages/lending/market/InterestRateModel.tsx';
import { useTranslate } from '@/i18n';
import DepositModal from '../dashboard/DepositModal';
import LendingModal from '../dashboard/LendingModal';
import { useState } from 'react';
import HomogenousInfo from './HomogenousInfo';

function MarketDetail() {
  const {
    tokenAsset,
    loading,
    interests,
    chartLoading,
    licensed,
    normalFloorOfHealthFactor,
    homoFloorOfHealthFactor,
    health,
    refresh,
  } = useMarketDetail();
  const navigate = useNavigate();

  const { t } = useTranslate();

  const [openDeposit, onOpenDeposit] = useState(false);
  const [openLending, onOpenLending] = useState(false);

  return (
    <div className="mt-[30px] flex  flex-col items-center p-[20px] max-md:mt-0 max-md:p-[16px] max-md:pb-[80px]">
      {openDeposit && tokenAsset && (
        <DepositModal
          asset={tokenAsset}
          onClose={() => {
            onOpenDeposit(false);
          }}
          refresh={refresh}
          userHealthFactor={health}
        />
      )}
      {openLending && tokenAsset && (
        <LendingModal
          asset={tokenAsset}
          onClose={() => {
            onOpenLending(false);
          }}
          refresh={refresh}
          userHealthFactor={health}
        />
      )}

      <div className="w-full max-w-[1200px]  overflow-hidden max-md:mx-[10px]">
        <div className="relative flex h-[50px] items-start justify-between">
          <div
            className="flex cursor-pointer items-center gap-[5px] hover:opacity-75"
            onClick={() => {
              navigate(-1);
            }}
          >
            <LeftOutlined className="text-[16px]" />
            <span className="pl-[5px] text-[25px]">
              {CHAINS.zeroGTest.icon}
            </span>
            <span className="text-[16px] font-[500]">
              {CHAINS.zeroGTest.name}
            </span>
          </div>
          <div className="flex items-center justify-end gap-[10px] max-md:absolute max-md:right-[10px] max-md:top-[0px]">
            <Button
              type="primary"
              className="rounded-[8px] text-[12px]"
              onClick={() => {
                onOpenDeposit(true);
              }}
            >
              {t('lending.supply')}
            </Button>
            <Button
              type="primary"
              className="rounded-[8px] text-[12px]"
              onClick={() => {
                onOpenLending(true);
              }}
            >
              {t('lending.borrow')}
            </Button>
          </div>
        </div>
        <div className="flex-center-between h-[140px] pb-[20px] max-md:h-[auto]">
          {loading || !tokenAsset ? (
            <Skeleton active avatar={false} />
          ) : (
            <AssetInfo asset={tokenAsset} />
          )}
        </div>
        <div className="flex w-full flex-col gap-[24px]">
          <div className="flex  flex-shrink-0 flex-col  gap-[24px] overflow-hidden max-md:flex-col">
            <TokenSupplyInfo
              asset={tokenAsset}
              loading={chartLoading}
              interests={interests}
              licensed={licensed}
            />
            <TokenBorrowInfo
              asset={tokenAsset}
              loading={chartLoading}
              interests={interests}
              normalFloorOfHealthFactor={normalFloorOfHealthFactor}
            />
            {Number(tokenAsset?.lending_mode_num || 0) > 1 && (
              <HomogenousInfo
                homoFloorOfHealthFactor={homoFloorOfHealthFactor}
                asset={tokenAsset}
              />
            )}
          </div>
          <div className="flex w-full flex-shrink-0 flex-col gap-[24px] overflow-hidden">
            <InterestRateModel
              asset={tokenAsset}
              mode={Number(tokenAsset?.lending_mode_num || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketDetail;
