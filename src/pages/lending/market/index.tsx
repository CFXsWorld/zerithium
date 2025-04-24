import ChainSelector from '@/pages/lending/dashboard/ChainSelector.tsx';
import MarketInfo from './MarketInfo.tsx';
import AssetsList from './AssetsList.tsx';
import useMarket from '@/pages/lending/hooks/useMarket.ts';
import { useEffect, useState } from 'react';
import { LendingAsset } from '@/types/Lending.ts';

function LendingMarket() {
  const {
    lendingAssets,
    loading,
    totalLendingSize,
    totalDepositSize,
    totalMarketSize,
  } = useMarket();

  const [data, setData] = useState<LendingAsset[]>([]);

  useEffect(() => {
    setData(lendingAssets);
  }, [lendingAssets]);

  const onFilter = (value: string) => {
    const filtered = lendingAssets.filter(
      (item) =>
        !value ||
        item.token.name?.toLowerCase().includes(value.toLowerCase()) ||
        item.token.symbol?.toLowerCase().includes(value.toLowerCase()) ||
        item.token.address?.toLowerCase().includes(value.toLowerCase())
    );
    setData(filtered);
  };
  return (
    <div className="mt-[30px] flex  flex-col items-center p-[20px]  max-md:mt-[0px] max-md:p-[16px] max-md:pb-[80px]">
      <div className="w-full max-w-[1200px]  overflow-hidden max-md:mx-[10px]">
        <div className="flex-center-between pb-[20px]">
          <ChainSelector />
        </div>
        <div className="flex-center-between pb-[20px]">
          <MarketInfo
            {...{ totalLendingSize, totalDepositSize, totalMarketSize }}
          />
        </div>
        <div className="flex w-full gap-[24px]">
          <AssetsList
            assets={data}
            loading={loading}
            onFilterChange={onFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default LendingMarket;
