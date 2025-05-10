import { formatCurrency, formatNumber } from '@/utils';
import HealthFactor from '@/components/Borrow/HealthFactor.tsx';
import { useMemo, useState } from 'react';
import RiskModal from '@/components/Borrow/RiskModal.tsx';
import { Button } from 'antd';
import { ZERITHIUM_LENDING_CONTRACT } from '@/contracts';
import { formatUnits } from 'ethers';
import BorrowMode from '@/components/Borrow/BorrowMode.tsx';
import { BorrowModeType } from '@/types/slc.ts';
import { useTranslate } from '@/i18n';
import useBorrowMode from '@/components/Borrow/useBorrowMode';
import useTokensWithPrice from '@/hooks/useTokensWithPrice.ts';
import useCalcRiskValue from '@/hooks/useCalcRiskValue';
import { Address } from 'viem';
import useTokenGroupAssets from '@/components/Borrow/useTokenGroupAssets';
import { TokenIcon } from '@/components/icons';
import { InfoCircleOutlined } from '@ant-design/icons';
const MarketInfo = ({
  netWorth,
  netApy,
  health,
  refetch,
}: {
  netWorth: bigint;
  netApy: bigint;
  health: number;
  refetch: () => void;
}) => {
  const { t } = useTranslate();
  const { effectiveMode, data } = useBorrowMode({
    ...ZERITHIUM_LENDING_CONTRACT.interface,
  });
  const { assets } = useTokenGroupAssets();

  const { tokens } = useTokensWithPrice();

  const riskIsolationToken = useMemo(
    () =>
      tokens.find(
        (item) =>
          item.address.toLowerCase() === (data as string[])?.[1].toLowerCase()
      ),
    [tokens, data]
  );

  const { availableAmount } = useCalcRiskValue(
    riskIsolationToken?.address as Address,
    effectiveMode
  );

  const tokenAssets = useMemo(() => {
    if (!assets?.length) return [];
    return assets.find(
      (items) => Number(items[0].lending_mode_num) === effectiveMode
    );
  }, [assets, effectiveMode]);

  const options = [
    {
      label: t('lending.borrow.mode.high.title'),
      description: t('lending.borrow.mode.high.description'),
      value: BorrowModeType.HighLiquidity,
    },
    {
      label: t('lending.borrow.mode.risk.title'),
      description: t('lending.borrow.mode.risk.description'),
      value: BorrowModeType.RiskIsolation,
    },
    {
      label: t('lending.borrow.mode.homogenous.title'),
      description: t('lending.borrow.mode.homogenous.description'),
      value: BorrowModeType.Homogenous,
    },
  ];

  const [riskOpen, setRiskOpen] = useState(false);

  const renderBorrrowModeInfo = () => {
    if (effectiveMode > 1 && tokenAssets?.length) {
      return (
        <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
          <span className="flex  items-center justify-end text-tc-secondary max-md:justify-start">
            {t('dex.swap.token')}
          </span>
          <span className="text-[16px] font-bold">
            <div className="flex">
              {tokenAssets.map((asset, index) => (
                <div
                  key={asset.token?.symbol}
                  className="flex items-center gap-[4px]"
                >
                  <div className="flex h-full w-[20px] items-center">
                    <TokenIcon
                      src={asset?.token.icon}
                      width={20}
                      height={20}
                      name={asset?.token?.symbol}
                    />
                  </div>
                  <div className="flex  flex-1  items-center">
                    <span className="text-[12px] text-tc-secondary">
                      {asset.token.symbol}
                    </span>
                  </div>
                  {index !== tokenAssets.length - 1 && (
                    <span className="px-[2px] text-tc-secondary">/</span>
                  )}
                </div>
              ))}
            </div>
          </span>
        </div>
      );
    }
    if (effectiveMode === BorrowModeType.RiskIsolation) {
      return (
        <>
          <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
            <span className="flex  items-center justify-end text-tc-secondary max-md:justify-start">
              {t('dex.swap.token')}
            </span>
            <span className="flex items-center justify-end gap-[10px] text-right text-[16px] font-bold max-md:justify-start">
              {riskIsolationToken?.symbol}
            </span>
          </div>
          <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
            <span className="flex  items-center justify-end text-tc-secondary max-md:justify-start">
              {t('lending.market.detail.available.amount')}
            </span>
            <span className="flex items-center justify-end gap-[10px] text-right text-[16px] font-bold max-md:justify-start">
              {formatNumber(
                Number(formatUnits(availableAmount < 0 ? 0 : availableAmount)),
                0
              )}
            </span>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex w-full items-center justify-between max-md:flex-row max-md:flex-wrap">
      <RiskModal
        open={riskOpen}
        onClose={() => setRiskOpen(false)}
        userHealthFactor={health}
        contact={{
          ...ZERITHIUM_LENDING_CONTRACT.interface,
        }}
      />
      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px] py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
        <span className="text-[16px] text-tc-secondary">
          {t('lending.net.worth')}
        </span>
        <span className="text-[20px] font-bold">
          {formatCurrency(Number(formatUnits(netWorth.toString())), true)}
        </span>
      </div>

      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
        <span className="text-[16px] text-tc-secondary">
          {t('lending.net.apy')}
        </span>
        <span className="text-[20px] font-bold">{`${Number(netApy.toString()) / 100}%`}</span>
      </div>
      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
        <span className="text-[16px] text-tc-secondary">
          {t('lending.health.factor')}
        </span>
        <div className="flex items-end gap-[10px] text-[16px] ">
          <HealthFactor value={`${health}`} />
          <Button
            type="text"
            ghost
            className="flex items-center gap-[1px] text-theme"
            size="small"
            onClick={() => setRiskOpen(true)}
          >
            {t('lending.health.risk.detail')}
            <InfoCircleOutlined />
          </Button>
        </div>
      </div>

      <div className="flex h-[84px] min-w-[200px] flex-col gap-[10px]  py-[12px] pr-[16px] max-md:min-w-[160px] max-md:flex-1">
        <span className="flex  items-center justify-end text-tc-secondary max-md:justify-start">
          {t('lending.borrow.mode')}
        </span>
        <div className="flex items-center justify-end gap-[10px] text-[16px] max-md:justify-start">
          <BorrowMode
            onSuccess={refetch}
            contact={{ ...ZERITHIUM_LENDING_CONTRACT.interface }}
            options={options}
            description={t('lending.borrow.mode.description')}
          />
        </div>
      </div>
      {renderBorrrowModeInfo()}
    </div>
  );
};
export default MarketInfo;
