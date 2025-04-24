import { Token } from '@/types/swap.ts';

import { cn } from '@/utils/classnames.ts';
import { ChangeEvent } from 'react';
import { useTranslate } from '@/i18n';
import { Skeleton } from 'antd';
import { TokenIcon } from './icons';
import { SLCToken } from '@/contracts';
import { useCommonStore } from '@/store/common';

const SLCTokenInput = ({
  title,
  editable,
  amount,
  onAmountChange,
  token,
  onMax,
  ownerAmount,
  placeholder = '0',
  amountLabel,
  loading,
}: {
  title: string;
  editable?: boolean;
  token?: Token;
  amount?: string;
  onAmountChange: (value: string) => void;
  disabledToken?: Token;
  onMax?: (ownerAmount: number) => void;
  ownerAmount: number;
  totalPrice?: number;
  placeholder?: string;
  amountLabel?: string;
  showDropArrow?: boolean;
  loading?: boolean;
  min?: number;
}) => {
  const { t } = useTranslate();
  const listingLimit = useCommonStore((state) => state.swapLimit?.[0] || 200);
  const presets = [
    {
      label: `${listingLimit}`,
      value: `${listingLimit}`,
    },
    {
      label: '1000',
      value: '1000',
    },
    {
      label: '3000',
      value: '3000',
    },
  ];
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
          <div className="flex-center gap-[5px]">
            <span className="flex-center text-[22px]">
              <TokenIcon src={SLCToken.icon} name={SLCToken?.symbol} />
            </span>
            <span className="text-[14px]">{SLCToken?.symbol}</span>
          </div>
        </div>
      </div>
      <div className="flex-center-between pb-[5px]">
        <div className="flex gap-[10px]">
          {presets.map((item) => (
            <div
              key={item.label}
              className={cn(
                'flex h-[26px] cursor-pointer items-center justify-center rounded-[6px] border border-line-primary px-[12px] text-[12px]'
              )}
              onClick={() => {
                onAmountChange(String(item.value));
              }}
            >
              <span style={{ minWidth: 30, textAlign: 'center' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex-center h-[32px] gap-[10px] text-[14px]">
          {token?.address && (
            <>
              <span className="text-tc-secondary">
                {label}: {ownerAmount}
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

export default SLCTokenInput;
