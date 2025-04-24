import TokenSelector from '@/components/XUSDTokenSelector';
import { Token } from '@/types/swap.ts';
import { cn } from '@/utils/classnames.ts';
import { ChangeEvent } from 'react';
import { useTranslate } from '@/i18n';
import { Skeleton } from 'antd';
import { formatNumber } from '@/hooks/useErc20Balance.ts';

const TokenInput = ({
  title,
  editable,
  amount,
  onAmountChange,
  token,
  onTokenChange,
  disabledToken,
  disabled,
  onMax,
  ownerAmount,
  totalPrice,
  placeholder = '0',
  amountLabel,
  showDropArrow = true,
  loading,
  decimals = 6,
}: {
  title: string;
  editable?: boolean;
  token?: Token;
  onTokenChange: (token: Token) => void;
  amount?: string;
  onAmountChange: (value: string) => void;
  disabledToken?: Token;
  disabled?: boolean;
  onMax?: (ownerAmount: number) => void;
  ownerAmount: number;
  totalPrice: number;
  placeholder?: string;
  amountLabel?: string;
  showDropArrow?: boolean;
  loading?: boolean;
  decimals?: number;
}) => {
  const { t } = useTranslate();
  const label = amountLabel || t('dex.swap.token.balance');
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    let value = event.target.value;
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = `${parts[0]}.${parts.slice(1).join('')}`;
    }
    if (value.startsWith('0') && value.length > 1 && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
    }
    onAmountChange(value);
  };

  return (
    <div className="h-[124px] rounded-[8px] bg-background-primary p-[16px]">
      <div className="text-[14px] text-tc-secondary">{title}</div>

      <div className="flex h-[48px] justify-around py-[5px]">
        <div className="flex-1">
          {loading ? (
            <Skeleton.Input active size="small" />
          ) : (
            <input
              className="w-full border-0 bg-transparent text-[30px] font-bold outline-0 focus:border-0 focus:bg-transparent "
              placeholder={placeholder}
              disabled={!editable}
              value={amount}
              onChange={handleChange}
            />
          )}
        </div>
        <div className="flex-shrink-0">
          <TokenSelector
            value={token}
            onChange={onTokenChange}
            disabledToken={disabledToken}
            disabled={disabled}
            showDropArrow={showDropArrow}
          />
        </div>
      </div>
      <div className="flex-center-between pb-[5px]">
        <span className="text-tc-secondary">
          {totalPrice > 0 ? `$${totalPrice}` : ''}
        </span>
        <div className="flex-center h-[32px] gap-[10px] text-[14px]">
          {token?.address && (
            <>
              <span className="text-tc-secondary">
                {label}: {formatNumber(ownerAmount, decimals)}
              </span>
              {onMax && ownerAmount > 0 && (
                <div
                  className={cn('cursor-pointer text-theme')}
                  onClick={() => {
                    onMax(ownerAmount);
                  }}
                >
                  {t('dex.swap.token.select.max')}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenInput;
