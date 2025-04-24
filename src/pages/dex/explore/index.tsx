import SwapTVL from './SwapTVL';
import SwapVolume from '@/pages/dex/explore/SwapVolume.tsx';
import { Outlet } from 'react-router-dom';
import useExplore from '../hooks/useExplore';

function Explore() {
  const { tvls, vols, getTvls, getVols } = useExplore();

  return (
    <div className="mt-[30px] flex  min-h-[420px]  flex-col items-center p-[20px] max-md:mt-0 max-md:p-[16px] max-md:pb-[80px]">
      <div className="max-md:mx-0 max-md:w-[calc(100%)] md:min-w-[1200px]">
        <div className="flex w-full gap-[20px] max-md:flex-col">
          <SwapTVL data={tvls?.items || []} getData={getTvls} />
          <SwapVolume data={vols?.items || []} getData={getVols} />
        </div>
        <div className="mt-[40px] flex flex-col gap-[20px]">
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
