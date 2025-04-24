import { LiquidityIcon, SwapIcon } from '@/components/icons';
import SwapPanel from './SwapPanel.tsx';
import ConfirmPanel from './ConfirmPanel.tsx';
import useAddLP from '@/pages/dex/hooks/useAddLP.ts';
import RouteTabs from '@/components/RouteTabs.tsx';
import { useTranslate } from '@/i18n';

function Liquidity() {
  const props = useAddLP();
  const { t } = useTranslate();
  return (
    <div className="flex flex-1 flex-col items-center justify-center pt-[40px] max-md:px-[10px] max-md:pt-[40px] ">
      <RouteTabs
        tabs={[
          { name: t('dex.swap.title'), path: '/', icon: <SwapIcon /> },
          {
            name: t('dex.liquidity.title'),
            path: '/dex/liquidity',
            icon: <LiquidityIcon />,
          },
        ]}
        active="Liquidity"
      />
      {props.step === 'FILL' ? (
        <SwapPanel {...props} />
      ) : (
        <ConfirmPanel {...props} />
      )}
    </div>
  );
}

export default Liquidity;
