import TokenInput from '@/components/TokenInput.tsx';
import { PlusOutlined } from '@ant-design/icons';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button } from 'antd';
import useWalletAuth from '@/components/Wallet/useWalletAuth.ts';
import { LiquidityReturnType } from '@/pages/dex/hooks/useAddLP.ts';
import { isNumeric } from '@/utils/isNumeric.ts';
import LiquidityInfo from '@/pages/dex/liquidity/LiquidityInfo.tsx';
import Warning from '@/components/Warning.tsx';
import { Link } from 'react-router-dom';
import { useTranslate } from '@/i18n';

const SwapPanel = ({
  tokenAAmount,
  tokenBAmount,
  tokenA,
  tokenB,
  onTokenBAmountChange,
  onTokenAAmountChange,
  onTokenBChange,
  onTokenAChange,
  tokenAOwnerAmount,
  tokenBOwnerAmount,
  tokenASLCPairAddress,
  tokenBSLCPairAddress,
  isReady,
  shareOfPool,
  setStep,
  loading,
  lpPairInfo,
  tokenATotalPrice,
  tokenBTotalPrice,
  tokenAMinimum1000,
  tokenBMinimum1000,
}: LiquidityReturnType) => {
  const { disabled: invalidWallet } = useWalletAuth();
  const { t } = useTranslate();
  const renderAction = () => {
    if (loading) {
      return (
        <Button
          className="w-full"
          type="primary"
          size="large"
          loading={loading}
          disabled
        >
          {t('dex.liquidity.add')}
        </Button>
      );
    }
    if (tokenA?.address && tokenB?.address) {
      if (!tokenASLCPairAddress) {
        return (
          <div className="flex flex-col gap-[10px]">
            <Warning>{t('dex.liquidity.no.pair.address.tip')}</Warning>
            <Link to={`/dex/listing?tokenA=${tokenA?.address}`}>
              <Button className="w-full" type="primary" size="large">
                {t('dex.pools.initialize.pool', {
                  name: `${tokenA?.symbol}`,
                })}
              </Button>
            </Link>
          </div>
        );
      }
      if (!tokenBSLCPairAddress) {
        return (
          <div className="flex flex-col gap-[10px]">
            <Warning>{t('dex.liquidity.no.pair.address.tip')}</Warning>
            <Link to={`/dex/listing?tokenA=${tokenB?.address}`}>
              <Button className="w-full" type="primary" size="large">
                {t('dex.pools.initialize.pool', {
                  name: `${tokenB?.symbol}`,
                })}
              </Button>
            </Link>
          </div>
        );
      }
      if (!lpPairInfo?.pairAddress) {
        return (
          <div className="flex flex-col gap-[10px]">
            <Warning>{t('dex.liquidity.no.pair.address.tip')}</Warning>
            <Link
              to={`/dex/create-pool?tokenA=${tokenA?.address}&tokenB=${tokenB?.address}`}
            >
              <Button className="w-full" type="primary" size="large">
                {t('dex.pools.create')}
              </Button>
            </Link>
          </div>
        );
      }
      if (isNumeric(tokenAAmount) && Number(tokenAAmount) > tokenAOwnerAmount) {
        return (
          <Button className="w-full" type="primary" size="large" disabled>
            {t('common.error.insufficient', { name: `${tokenA?.symbol}` })}
          </Button>
        );
      }
      if (isNumeric(tokenBAmount) && Number(tokenBAmount) > tokenBOwnerAmount) {
        return (
          <Button className="w-full" type="primary" size="large" disabled>
            {t('common.error.insufficient', { name: `${tokenB?.symbol}` })}
          </Button>
        );
      }
    }

    return (
      <div className="flex flex-col gap-[10px]">
        {lpPairInfo?.isInitialPool && (
          <Warning>{t('dex.liquidity.less.then.tip')}</Warning>
        )}
        <Button
          className="w-full"
          type="primary"
          size="large"
          onClick={() => {
            setStep('CONFIRM');
          }}
          disabled={!isReady || !tokenAMinimum1000 || !tokenBMinimum1000}
        >
          {!tokenAMinimum1000 || !tokenBMinimum1000
            ? t('dex.liquidity.minimum.message', {
                name: `${!tokenAMinimum1000 ? 'TokenA' : 'TokenB'}`,
              })
            : t('dex.liquidity.add')}
        </Button>
      </div>
    );
  };
  return (
    <div className="mt-[30px] min-h-[420px] w-[500px] rounded-[20px]  bg-fill-niubi p-[20px] max-md:w-full max-md:px-[10px]">
      <div className="mt-[20px]">
        <TokenInput
          title={t('dex.liquidity.input.tokenA')}
          editable
          token={tokenA}
          onTokenChange={onTokenAChange}
          amount={tokenAAmount}
          onAmountChange={onTokenAAmountChange}
          disabledToken={tokenB}
          disabled={invalidWallet}
          onMax={(ownerAmount) => {
            onTokenAAmountChange(ownerAmount.toString());
          }}
          ownerAmount={tokenAOwnerAmount}
          totalPrice={tokenATotalPrice}
        />
        <div className="relative h-[20px]">
          <div className="flex-center  absolute left-[50%]  top-[-8px] h-[36px] w-[36px] -translate-x-[50%] transform rounded-[2px] border-[3px] border-line-primary2 bg-background-primary">
            <PlusOutlined />
          </div>
        </div>
        <TokenInput
          title={t('dex.liquidity.input.tokenB')}
          editable
          token={tokenB}
          onTokenChange={onTokenBChange}
          amount={tokenBAmount}
          onAmountChange={onTokenBAmountChange}
          disabledToken={tokenA}
          disabled={invalidWallet}
          onMax={(ownerAmount) => {
            onTokenBAmountChange(ownerAmount.toString());
          }}
          ownerAmount={tokenBOwnerAmount}
          totalPrice={tokenBTotalPrice}
        />
      </div>
      {isReady && tokenASLCPairAddress && tokenBSLCPairAddress && (
        <div className="px-[20px] py-[10px]">
          <LiquidityInfo
            tokenA={tokenA}
            tokenBAmount={tokenBAmount}
            tokenB={tokenB}
            tokenAAmount={tokenAAmount}
            shareOfPool={shareOfPool}
          />
        </div>
      )}
      <div className="mt-[20px] w-full">
        <WithAuthButton>{renderAction()}</WithAuthButton>
      </div>
    </div>
  );
};

export default SwapPanel;
