import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { useTranslate } from '@/i18n';

// 十进制 value
const HealthFactor = ({
  value,
  decimals = 4,
}: {
  value: string;
  decimals?: number;
}) => {
  const { t } = useTranslate();
  if (value) {
    if (Number(value) >= 10) {
      return (
        <span className="text-status-success">{t('lending.health.fine')}</span>
      );
    }
    if (Number(value) >= 2) {
      return (
        <span className="text-status-success">
          {formatNumber(Number(value), decimals)}
        </span>
      );
    }
    if (Number(value) >= 1.5 && Number(value) < 4) {
      return (
        <span className="text-status-warning">
          {formatNumber(Number(value), decimals)}
        </span>
      );
    }
    if (Number(value) < 1.5) {
      return (
        <span className="text-status-error">
          {formatNumber(Number(value), decimals)}
        </span>
      );
    }
  }
  return <span>0</span>;
};

export default HealthFactor;
