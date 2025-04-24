import { useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, LeftOutlined } from '@ant-design/icons';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button, Input, Skeleton } from 'antd';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { useTranslate } from '@/i18n';
import { isNumeric } from '@/utils/isNumeric';
import useApprove from '../hooks/useApprove';
import { Address } from 'viem';
import { formatNumber } from '@/hooks/useErc20Balance';
import useRemoveLP from '../hooks/useRemoveLP';
import { TokenIcon } from '@/components/icons';
import { maskAddress4 } from '@/utils';
import { cn } from '@/utils/classnames';
import TokenWithIcon from '@/components/TokenWithIcon';
import { useCopy } from '@/hooks/useCopy';
import Warning from '@/components/Warning';

const getPerAmount = (amountA: string, amountB: string) => {
  if (!amountA || !amountB || !isNumeric(amountA) || !isNumeric(amountB)) {
    return '0';
  }

  const numA = Number(amountA);
  const numB = Number(amountB);

  if (numA === 0) {
    return '0';
  }

  return formatNumber(numB / numA, 6);
};

const AmountSelector = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => {
  const presets = [
    {
      label: '25%',
      value: '25',
    },

    {
      label: '50%',
      value: '50',
    },
    {
      label: '100%',
      value: '100',
    },
  ];
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex  flex-nowrap items-center gap-[10px] ">
        {presets.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex h-[32px] cursor-pointer items-center justify-center rounded-[6px] border border-line-primary px-[12px] text-[12px]',
              {
                'border-transparent bg-theme text-white': value === item.value,
                'opacity-65': !!disabled,
              }
            )}
            onClick={() => {
              if (!disabled) {
                onChange(String(item.value));
              }
            }}
          >
            <span style={{ minWidth: 30, textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        ))}
        <Input
          value={Number(value || 0) > 1 ? value : undefined}
          placeholder="75"
          addonAfter={`%`}
          disabled={disabled}
          onChange={(e) => {
            let value = e.target.value;
            value = value.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) {
              value = `${parts[0]}.${parts.slice(1).join('')}`;
            }
            if (
              value.startsWith('0') &&
              value.length > 1 &&
              !value.startsWith('0.')
            ) {
              value = value.replace(/^0+/, '');
            }
            if (Number(value) > 100) {
              value = '100';
            }

            onChange(value);
          }}
        />
      </div>
    </div>
  );
};

function RemoveLiquidity() {
  const {
    tokenA,
    tokenB,
    fee,
    apr,
    availableLPAmount,
    tokenAReceiveAmount,
    tokenBReceiveAmount,
    shareOfPool,
    setRemoveAmount,
    loading,
    removeAmount,
    pairToken,
    removePercent,
    pool,
    remove,
  } = useRemoveLP();

  const { t } = useTranslate();
  const {
    isApproved,
    loading: approveLoading,
    approve: approveTokenA,
  } = useApprove({
    token: pairToken!,
    amount: String(removeAmount),
    spenderAddress: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
  });

  const navigate = useNavigate();

  const { copy } = useCopy();

  return (
    <div className="mb-[60px] flex flex-1 flex-col items-center justify-center pt-[20px] max-md:px-[10px] max-md:pt-[20px]">
      {loading && (
        <div className="mt-[30px] min-h-[420px]  w-[500px]  rounded-[20px] bg-fill-niubi  p-[20px] max-md:w-full max-md:px-[10px]">
          <Skeleton />
        </div>
      )}
      {!loading && (
        <div className="mt-[30px] min-h-[420px] w-[500px] rounded-[20px]  bg-fill-niubi p-[20px] max-md:w-full ">
          <div
            onClick={() => {
              navigate(-1);
            }}
            className="inline-block w-auto cursor-pointer  hover:text-theme"
          >
            <LeftOutlined />
            <span className="pl-[10px]">{t('dex.liquidity.remove')}</span>
          </div>
          <div className="mt-[20px]">
            <div className="flex  gap-[10px]">
              <span className="flex">
                <TokenIcon
                  src={pool?.tokenA.icon}
                  width={20}
                  height={20}
                  name={pool?.tokenA.symbol}
                />
                <TokenIcon
                  src={pool?.tokenB.icon}
                  width={20}
                  height={20}
                  className="ml-[-5px]"
                  name={pool?.tokenB.symbol}
                />
              </span>
              <span className="text-[16px] font-bold">
                {`${pool?.tokenA.symbol} / ${pool?.tokenB.symbol}`}
              </span>
            </div>
            <div className="mt-[30px] flex gap-[10px] max-md:flex-wrap">
              <div className="flex flex-1 flex-col">
                <span className="text-tc-secondary">{t('common.fees24h')}</span>
                <span className="mt-[10px] text-[16px]">{fee}%</span>
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-tc-secondary">{t('common.APR24h')}</span>
                <span className="mt-[10px] text-[16px]">{apr}</span>
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-tc-secondary">{tokenA?.symbol}</span>
                <span
                  className="mt-[10px] cursor-pointer text-[16px] hover:text-theme"
                  onClick={() => {
                    copy(tokenA?.address || '');
                  }}
                >
                  {maskAddress4(tokenA?.address || '')}
                </span>
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-tc-secondary">{tokenB?.symbol}</span>
                <span
                  className="mt-[10px] cursor-pointer  text-[16px] hover:text-theme"
                  onClick={() => {
                    copy(tokenB?.address || '');
                  }}
                >
                  {maskAddress4(tokenB?.address || '')}
                </span>
              </div>
            </div>
            <div className="py-[30px]">
              <div className="text-[16px]">Available remove amount</div>
              <div className="mt-[10px] text-[20px] font-bold">
                {availableLPAmount}
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between">
                <span className="text-tc-secondary">Share of pool</span>
                <span> {shareOfPool}%</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-tc-secondary">Position</span>
                <div className="flex flex-col">
                  <span className="text-right text-[14px]">
                    1 {tokenA?.symbol}
                  </span>
                  <span className="text-right text-[14px]">
                    {getPerAmount(
                      String(tokenAReceiveAmount),
                      String(tokenBReceiveAmount)
                    )}
                    {tokenB?.symbol}
                  </span>
                </div>
              </div> */}
            </div>
          </div>

          <div className="mt-[30px] flex flex-col gap-[10px]">
            <div className="text-[16px]">Remove Amount</div>
            <AmountSelector
              value={removePercent}
              onChange={setRemoveAmount}
              disabled={!availableLPAmount}
            />
          </div>

          <div className="mt-[30px] flex  flex-col gap-[10px] rounded-[6px] border px-[10px] py-[20px]">
            <div className="mb-[10px] text-[14px] text-tc-secondary">
              You receive at least
            </div>
            <div className="flex items-center justify-between">
              <TokenWithIcon token={tokenA!} className="text-tc-secondary" />
              <span>{tokenAReceiveAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <TokenWithIcon token={tokenB!} className="text-tc-secondary" />
              <span>{tokenBReceiveAmount}</span>
            </div>
          </div>

          <div className="mt-[20px] flex justify-between">
            <span className="text-tc-secondary">Rates</span>
            <div className="flex flex-col gap-[5px]">
              <div className="flex items-center justify-end gap-[5px]">
                <span>1 {tokenA?.symbol}</span>
                <span>≈</span>
                <span>
                  {getPerAmount(
                    String(tokenAReceiveAmount),
                    String(tokenBReceiveAmount)
                  )}
                  {tokenB?.symbol}
                </span>
              </div>
              <div className="flex items-center justify-end gap-[5px]">
                <span>1 {tokenB?.symbol}</span>
                <span>≈</span>
                <span>
                  {getPerAmount(
                    String(tokenBReceiveAmount),
                    String(tokenAReceiveAmount)
                  )}
                  {tokenA?.symbol}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-[20px] flex flex-col gap-[10px]">
            <Warning>{t('dex.liquidity.remove.tip')}</Warning>
            <Button
              className="flex-1"
              type="primary"
              size="large"
              disabled={isApproved || !removePercent}
              icon={isApproved ? <CheckCircleOutlined /> : null}
              loading={approveLoading && !isApproved}
              onClick={approveTokenA}
            >
              {isApproved
                ? t('common.approved', { name: `${pairToken?.symbol || ''}` })
                : t('common.approve.to', { name: `${pairToken?.symbol}` })}
            </Button>
            <WithAuthButton>
              <Button
                className="w-full"
                type="primary"
                size="large"
                disabled={!removePercent || !isApproved}
                loading={loading}
                onClick={remove}
              >
                {t('dex.liquidity.remove')}
              </Button>
            </WithAuthButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default RemoveLiquidity;
