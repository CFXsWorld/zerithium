import ChainSelector from '@/pages/lending/dashboard/ChainSelector';
import MarketInfo from '@/pages/lending/dashboard/MarketInfo';
import Supplies from '@/pages/lending/dashboard/Supplies';
import AssetsToSupply from '@/pages/lending/dashboard/AssetsToSupply';
import Borrows from '@/pages/lending/dashboard/Borrows';
import AssetsToBorrow from '@/pages/lending/dashboard/AssetsToBorrow';
import useDashboard from '@/pages/lending/hooks/useDashboard.ts';

function Dashboard() {
  const {
    netWorth,
    netApy,
    health,
    lendingAssets,
    loading,
    depositTotalCollateralBalance,
    depositTotalAPY,
    depositTotalBalance,
    lendingTotalBalance,
    lendingTotalAPY,
    lendingPowerUsed,
    refetch,
  } = useDashboard();
  return (
    <div className="max-md:mt-0px mt-[30px]  flex flex-col items-center p-[20px] max-md:px-[16px] max-md:pb-[80px]">
      <div className="w-full max-w-[1200px]  overflow-hidden max-md:mx-0">
        <div className="flex-center-between pb-[20px] max-md:pb-[5px]">
          <ChainSelector />
        </div>
        <div className="flex-center-between pb-[20px] max-md:flex-col max-md:justify-start">
          <MarketInfo
            netWorth={netWorth}
            netApy={netApy}
            health={health}
            refetch={refetch}
          />
        </div>
        <div className="flex justify-between gap-[24px] max-md:flex-col">
          <div className="flex w-[600px] flex-shrink-0 flex-col gap-[24px] overflow-hidden max-md:w-full ">
            <Supplies
              assets={lendingAssets}
              loading={loading}
              depositTotalBalance={depositTotalBalance}
              depositTotalCollateralBalance={depositTotalCollateralBalance}
              depositTotalAPY={depositTotalAPY}
              health={health}
              refetch={() => {
                refetch();
              }}
            />
            <AssetsToSupply
              assets={lendingAssets}
              loading={loading}
              health={health}
              refetch={() => {
                refetch();
              }}
            />
          </div>
          <div className="flex w-[580px] flex-shrink-0 flex-col gap-[24px] overflow-hidden max-md:w-full">
            <Borrows
              assets={lendingAssets}
              loading={loading}
              lendingTotalBalance={lendingTotalBalance}
              lendingTotalAPY={lendingTotalAPY}
              lendingPowerUsed={lendingPowerUsed}
              health={health}
              refetch={() => {
                refetch();
              }}
            />
            <AssetsToBorrow
              assets={lendingAssets}
              loading={loading}
              health={health}
              refetch={() => {
                refetch();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
