import { LeftOutlined } from '@ant-design/icons';
import { ConfirmContent } from '@/pages/dex/swap/SwapInfo.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button } from 'antd';
import { SwapReturnType } from '@/pages/dex/hooks/useSwap.ts';
import { Token } from '@/types/swap.ts';
import useApprove from '@/pages/dex/hooks/useApprove.ts';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { Address } from 'viem';
import useSwapConfirm from '@/pages/dex/hooks/useSwapConfirm.ts';
import { TokenIcon } from '@/components/icons';
import { WriteContractMutateAsync } from '@wagmi/core/query';
import { useTranslate } from '@/i18n';

const TokenItem = ({
  token,
  amount,
  title,
}: {
  token?: Token;
  amount?: string;
  title?: string;
}) => {
  return (
    <div className="flex flex-col">
      <p className="text-[14px] text-tc-secondary">{title}</p>
      <div className="flex items-center py-[10px]">
        <span className="flex-1 text-[26px] font-bold">{amount}</span>
        <div className="flex-center gap-[5px]">
          <span className="flex-center text-[20px]">
            <TokenIcon
              src={token?.icon}
              width={20}
              height={20}
              name={token?.symbol}
            />
          </span>
          <span>{token?.symbol}</span>
        </div>
      </div>
    </div>
  );
};

const ConfirmPanel = ({
  slippage,
  inputToken,
  outputToken,
  payAmount,
  receiveAmount,
  priceImpact,
  fee,
  estReceived,
  minReceived,
  feeAmount,
  isInsufficient,
  isReady,
  onFillSwap,
  deadline,
  router,
  isSubmittedLoading,
  writeContractAsync,
}: SwapReturnType & {
  isSubmittedLoading?: boolean;
  writeContractAsync: WriteContractMutateAsync<any>;
}) => {
  const { isApproved, loading, approve } = useApprove({
    token: inputToken!,
    amount: payAmount,
    spenderAddress: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
  });
  const { confirm } = useSwapConfirm({
    inputToken,
    outputToken,
    payAmount,
    receiveAmount,
    slippage,
    deadline,
    router,
    writeContractAsync,
  });

  const { t } = useTranslate();
  return (
    <>
      <a
        className="inline-block w-auto cursor-pointer  hover:text-theme"
        onClick={onFillSwap}
      >
        <LeftOutlined />
        <span className="pl-[10px]">{t('dex.swap.confirm')}</span>
      </a>
      <div className="mt-[20px]">
        <TokenItem
          token={inputToken}
          amount={payAmount}
          title={t('dex.swap.input.pay')}
        />
        <TokenItem
          token={outputToken}
          amount={receiveAmount}
          title={t('dex.swap.input.receive')}
        />
      </div>
      <div className="px-[10px] py-[20px] text-[14px]">
        <ConfirmContent
          slippage={slippage}
          priceImpact={priceImpact}
          fee={fee}
          feeAmount={feeAmount}
          estReceived={estReceived}
          minReceived={minReceived}
          inputToken={inputToken}
          outputToken={outputToken}
          router={router}
        />
      </div>
      <div className="rounded-[8px] bg-status-warning-non-opaque p-[10px]">
        <span className="text-[14px]">
          {t('dex.swap.confirm.tip', {
            amount: `${receiveAmount} ${outputToken?.symbol}`,
          })}
        </span>
      </div>
      <div className="mt-[20px] w-full">
        <WithAuthButton
          disabled={!isReady || isInsufficient}
          onClick={() => {
            if (!isApproved) {
              approve();
            } else {
              confirm();
            }
          }}
        >
          <Button
            className="h-[56px]  w-full"
            type="primary"
            size="large"
            loading={loading || isSubmittedLoading}
          >
            {!isApproved
              ? t('dex.swap.give.permission', {
                  name: `${inputToken?.symbol}`,
                })
              : t('dex.swap.title')}
          </Button>
        </WithAuthButton>
      </div>
    </>
  );
};

export default ConfirmPanel;
