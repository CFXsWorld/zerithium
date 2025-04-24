import { UpOutlined } from '@ant-design/icons';
import { SlippageValue } from '@/pages/dex/swap/Slippage.tsx';
import { SwapRoute, Token } from '@/types/swap.ts';
import { useState } from 'react';
import { cn } from '@/utils/classnames.ts';
import RouteInfo from '@/pages/dex/swap/RouteInfo.tsx';
import { ExchangeIcon } from '@/components/icons';
import { useTranslate } from '@/i18n';

interface SwapInfoProps {
  slippage: string;
  priceImpact: number;
  fee: number;
  feeAmount: number;
  estReceived: number;
  minReceived: number;
  outputToken?: Token;
  inputToken?: Token;
  toPairUnit?: { amount: number; price: number };
  fromPairUnit?: { amount: number; price: number };
  router?: SwapRoute;
}

export const ConfirmContent = ({
  slippage,
  priceImpact,
  fee,
  feeAmount,
  estReceived,
  minReceived,
  router,
  outputToken,
}: SwapInfoProps) => {
  const { t } = useTranslate();
  return (
    <div className="mt-[10px] flex flex-col gap-[6px]">
      <div className="flex-center-between">
        <span className="text-tc-secondary">{t('dex.swap.price.impact')}</span>
        <span className={cn({ 'text-red-600': Math.abs(priceImpact) > 3 })}>
          ≈ {priceImpact}%
        </span>
      </div>
      <div className="flex-center-between">
        <span className="text-tc-secondary">
          {t('dex.swap.slippage.tolerance')}
        </span>
        <SlippageValue value={Number(slippage || 0)} />
      </div>
      <div className="flex-center-between">
        <span className="text-tc-secondary">
          {`${t('dex.swap.fee')}(${fee}%)`}
        </span>
        <span>${feeAmount}</span>
      </div>
      <div className="flex-center-between">
        <span className="text-tc-secondary">{t('dex.swap.est.received')}</span>
        <span>
          {estReceived} {outputToken?.symbol}
        </span>
      </div>
      <div className="flex-center-between">
        <span className="text-tc-secondary">{t('dex.swap.min.received')}</span>
        <span>
          {minReceived} {outputToken?.symbol}
        </span>
      </div>
      <div className="flex-center-between">
        <span className="text-tc-secondary">{t('dex.swap.route')}</span>
        <RouteInfo router={router} />
      </div>
    </div>
  );
};

const SwapInfo = ({
  outputToken,
  inputToken,
  toPairUnit,
  fromPairUnit,
  ...rest
}: SwapInfoProps) => {
  const [fold, setFold] = useState(true);
  const [route, setRoute] = useState<'FROM' | 'TO'>('FROM');
  const onUnitChange = () => {
    setRoute(route === 'FROM' ? 'TO' : 'FROM');
  };

  return (
    <div>
      <div className="flex-center-between">
        <div className="flex-center cursor-pointer" onClick={onUnitChange}>
          <ExchangeIcon />
          <span>
            {route === 'FROM'
              ? ` 1${inputToken?.symbol} = ${fromPairUnit?.amount || 0}${outputToken?.symbol}`
              : ` 1${outputToken?.symbol} = ${toPairUnit?.amount || 0}${inputToken?.symbol}`}
          </span>
        </div>
        <div
          className="flex-center cursor-pointer gap-[5px]"
          onClick={() => {
            setFold(!fold);
          }}
        >
          <span className="text-tc-secondary">
            $
            {route === 'FROM'
              ? fromPairUnit?.price || 0
              : toPairUnit?.price || 0}
          </span>
          <UpOutlined
            className={cn(
              'rotate-180 text-[12px] text-tc-secondary transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]',
              { 'rotate-0': fold }
            )}
          />
        </div>
      </div>
      {fold && (
        <ConfirmContent
          {...rest}
          inputToken={inputToken}
          outputToken={outputToken}
        />
      )}
    </div>
  );
};

export default SwapInfo;
