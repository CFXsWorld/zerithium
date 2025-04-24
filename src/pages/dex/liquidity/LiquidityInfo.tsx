import { Token } from '@/types/swap.ts';
import { isNumeric } from '@/utils/isNumeric.ts';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { useTranslate } from '@/i18n';

export const getPerAmount = (amountA: string, amountB: string) => {
  if (!isNumeric(amountA) || !isNumeric(amountB)) return 0;
  return formatNumber(Number(amountB) / Number(amountA), 6);
};

const LiquidityInfo = ({
  tokenA,
  tokenB,
  tokenAAmount,
  tokenBAmount,
  shareOfPool,
}: {
  tokenA?: Token;
  tokenB?: Token;
  tokenAAmount: string;
  tokenBAmount: string;
  shareOfPool: number;
}) => {
  const { t } = useTranslate();
  return (
    <div className="mt-[10px] flex flex-col gap-[6px]">
      <div className="flex-center-between">
        <span className="text-tc-secondary">
          {tokenA?.symbol} {t('dex.liquidity.per')} {tokenB?.symbol}
        </span>
        <span>{getPerAmount(tokenAAmount, tokenBAmount)}</span>
      </div>
      <div className="flex-center-between">
        <span className="text-tc-secondary">
          {tokenB?.symbol} {t('dex.liquidity.per')} {tokenA?.symbol}
        </span>
        <span>{getPerAmount(tokenBAmount, tokenAAmount)}</span>
      </div>
      <div className="flex-center-between">
        <span className="text-tc-secondary">
          {t('dex.liquidity.share.of.pool')}
        </span>
        <span>{shareOfPool}%</span>
      </div>
    </div>
  );
};

export default LiquidityInfo;
