import { LiquidityIcon, SwapIcon } from '@/components/icons';
import RouteTabs from '@/components/RouteTabs.tsx';
import { useTranslate } from '@/i18n';
import Swap from './Swap';

function SwapPage() {
  const { t } = useTranslate();
  return (
    <div className="flex flex-1 flex-col items-center justify-center pt-[40px] max-md:pt-[40px] ">
      <RouteTabs
        tabs={[
          { name: t('dex.swap.title'), path: '/', icon: <SwapIcon /> },
          {
            name: t('dex.liquidity.title'),
            path: '/dex/liquidity',
            icon: <LiquidityIcon />,
          },
        ]}
        active="Swap"
      />
      <div className="mt-[30px] max-md:px-[10px]">
        <Swap />
      </div>
    </div>
  );
}

export default SwapPage;
