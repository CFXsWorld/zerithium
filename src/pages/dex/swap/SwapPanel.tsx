import Slippage from '@/pages/dex/swap/Slippage.tsx';
import TokenInput from '@/components/TokenInput.tsx';
import { ArrowDownOutlined } from '@ant-design/icons';
import SwapInfo from '@/pages/dex/swap/SwapInfo.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button } from 'antd';
import useWalletAuth from '@/components/Wallet/useWalletAuth.ts';
import useSwap, { SwapReturnType } from '@/pages/dex/hooks/useSwap.ts';
import SecondTabs from '@/pages/dex/swap/SecondTabs.tsx';
import { useTranslate } from '@/i18n';
import useXWriteContract from '@/hooks/useXWriteContract';
import { WriteContractMutateAsync } from '@wagmi/core/query';
import ConfirmPanel from './ConfirmPanel';
import { Token } from '@/types/swap';

const Swap = ({
  slippage,
  onExchange,
  inputToken,
  setInputToken,
  setOutputToken,
  outputToken,
  payAmount,
  setPayAmount,
  receiveAmount,
  setReceiveAmount,
  priceImpact,
  fee,
  estReceived,
  minReceived,
  feeAmount,
  inputOwnerAmount,
  outputOwnerAmount,

  outputTokenTotalPrice,
  inputTokenTotalPrice,
  toPairUnit,
  fromPairUnit,
  isInsufficient,
  isReady,
  isInsufficientLiquidity,
  onConfirm,
  router,
  isTokenBLoading,
  isTokenALoading,
  setSlippage,
  deadline,
  setDeadline,
  onSwapTypeChange,
}: SwapReturnType & {
  onSwapTypeChange: (value: string) => void;
}) => {
  const { disabled } = useWalletAuth();

  const { t } = useTranslate();

  const renderSwapText = () => {
    if (isInsufficient) {
      return t('common.error.insufficient', { name: `${inputToken?.symbol}` });
    }
    if (isInsufficientLiquidity) {
      return t('common.error.insufficient.liquidity');
    }
    return t('dex.swap.title');
  };
  return (
    <>
      <div className="flex items-center justify-between ">
        <SecondTabs active="swap" onChange={onSwapTypeChange} />
        <Slippage
          value={slippage}
          onChange={setSlippage}
          disabled={disabled}
          deadline={deadline}
          onDeadlineChange={setDeadline}
        />
      </div>
      <div className="mt-[20px]">
        <TokenInput
          title={t('dex.swap.input.pay')}
          editable
          token={inputToken}
          onTokenChange={setInputToken}
          amount={payAmount}
          onAmountChange={setPayAmount}
          disabledToken={outputToken}
          disabled={disabled}
          onMax={(ownerAmount) => {
            setPayAmount(ownerAmount.toString());
          }}
          ownerAmount={inputOwnerAmount}
          totalPrice={inputTokenTotalPrice}
          loading={isTokenALoading}
        />
        <div
          className="relative h-[20px] cursor-pointer hover:opacity-75"
          onClick={onExchange}
        >
          <div className="flex-center  absolute left-[50%]  top-[-8px] h-[36px] w-[36px] -translate-x-[50%] transform rounded-[2px] border-[3px] border-line-primary2 bg-background-primary">
            <ArrowDownOutlined />
          </div>
        </div>
        <TokenInput
          title={t('dex.swap.input.receive')}
          editable
          token={outputToken}
          onTokenChange={setOutputToken}
          amount={receiveAmount}
          onAmountChange={setReceiveAmount}
          disabledToken={inputToken}
          disabled={disabled}
          ownerAmount={outputOwnerAmount}
          totalPrice={outputTokenTotalPrice}
          loading={isTokenBLoading}
        />
      </div>
      {isReady &&
        !!toPairUnit &&
        !isInsufficient &&
        !isInsufficientLiquidity && (
          <div className="px-[10px] py-[20px] text-[14px]">
            <SwapInfo
              slippage={slippage}
              priceImpact={priceImpact}
              fee={fee}
              feeAmount={feeAmount}
              estReceived={estReceived}
              minReceived={minReceived}
              inputToken={inputToken}
              outputToken={outputToken}
              toPairUnit={toPairUnit}
              fromPairUnit={fromPairUnit}
              router={router}
            />
          </div>
        )}

      <div className="mt-[20px] h-[56px]  w-full">
        <WithAuthButton>
          <Button
            className="w-full"
            type="primary"
            size="large"
            disabled={
              !isReady ||
              isInsufficient ||
              isInsufficientLiquidity ||
              !toPairUnit
            }
            onClick={onConfirm}
          >
            {renderSwapText()}
          </Button>
        </WithAuthButton>
      </div>
    </>
  );
};

const SwapPanel = ({
  onSwapTypeChange,
  receiveToken,
  onReceiveChange,
}: {
  onSwapTypeChange: (value: string) => void;
  receiveToken?: Token;
  onReceiveChange?: (token?: Token) => void;
}) => {
  const { swapStep, onFillSwap, ...rest } = useSwap({
    receiveToken,
    onReceiveChange,
  });
  const { writeContractAsync, isSubmittedLoading } = useXWriteContract({
    onSubmitted: () => {
      onFillSwap?.();
    },
  });
  const props = {
    onSwapTypeChange,
  };

  return (
    <div className="min-h-[420px] w-[500px] shrink-0  rounded-[20px] bg-fill-niubi p-[20px] max-md:w-full">
      {swapStep === 'FILL' ? (
        <Swap {...props} {...rest} />
      ) : (
        <ConfirmPanel
          {...rest}
          onFillSwap={onFillSwap}
          writeContractAsync={
            writeContractAsync as WriteContractMutateAsync<any>
          }
          isSubmittedLoading={isSubmittedLoading}
        />
      )}
    </div>
  );
};

export default SwapPanel;
