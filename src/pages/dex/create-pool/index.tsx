import { Link } from 'react-router-dom';
import {
  CheckCircleOutlined,
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import TokenInput from '@/components/TokenInput.tsx';
import useCreatePool from '@/pages/dex/hooks/useCreatePool.ts';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button } from 'antd';
import { isSLCToken, ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import Warning from '@/components/Warning.tsx';
import { useTranslate } from '@/i18n';
import { isNumeric } from '@/utils/isNumeric';
import useNativeToken from '@/hooks/useNativeToken';
import useApprove from '../hooks/useApprove';
import { Address } from 'viem';

function CreatePool() {
  const {
    tokenA,
    onTokenAChange,
    tokenAOwnerAmount,
    tokenB,
    onTokenBChange,
    tokenBOwnerAmount,
    tokenASLCPairAddress,
    tokenBSLCPairAddress,
    lpPairAddress,
    onCreate,
    loading,
    tokenAAmount,
    onTokenAAmountChange,
    onTokenBAmountChange,
    tokenBAmount,
    invalidWallet,
    disabled,
  } = useCreatePool();

  const { t } = useTranslate();
  const {
    isApproved: isTokenAApproved,
    loading: isTokenAApproving,
    approve: approveTokenA,
  } = useApprove({
    token: tokenA!,
    amount: tokenAAmount,
    spenderAddress: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
  });

  const { isNativeToken } = useNativeToken();

  const {
    isApproved: isTokenBApproved,
    loading: isTokenBApproving,
    approve: approveTokenB,
  } = useApprove({
    token: tokenB!,
    amount: tokenBAmount,
    spenderAddress: ZERITHIUM_SWAP_CONTRACT.interface.address as Address,
  });

  const approvedAll =
    (isNativeToken(tokenA!) || isTokenAApproved) &&
    (isNativeToken(tokenB!) || isTokenBApproved);

  const renderAction = () => {
    if (tokenA?.address && tokenB?.address) {
      if (!tokenASLCPairAddress && !isSLCToken(tokenB?.address)) {
        return (
          <div className="flex flex-col gap-[10px]">
            <Warning>{t('dex.liquidity.no.pair.address.tip')}</Warning>
            <Link to={`/dex/listing?tokenA=${tokenA?.address}`}>
              <WithAuthButton>
                <Button className="w-full" type="primary" size="large">
                  {t('dex.pools.initialize.pool', {
                    name: `${tokenA?.symbol}`,
                  })}
                </Button>
              </WithAuthButton>
            </Link>
          </div>
        );
      }
      if (!tokenBSLCPairAddress) {
        return (
          <div className="flex flex-col gap-[10px]">
            <Warning>{t('dex.liquidity.no.pair.address.tip')}</Warning>
            <Link to={`/dex/listing?tokenA=${tokenB?.address}`}>
              <WithAuthButton>
                <Button className="w-full" type="primary" size="large">
                  {t('dex.pools.initialize.pool', {
                    name: `${tokenB?.symbol}`,
                  })}
                </Button>
              </WithAuthButton>
            </Link>
          </div>
        );
      }
      if (lpPairAddress) {
        return (
          <Link
            to={`/dex/liquidity?tokenA=${tokenA?.address}&tokenB=${tokenB?.address}`}
          >
            <WithAuthButton>
              <Button className="mt-[20px] w-full" type="primary" size="large">
                {t('dex.liquidity.add')}
              </Button>
            </WithAuthButton>
          </Link>
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
      <>
        <Warning>{t('dex.pools.create.tip')}</Warning>
        {!disabled && (
          <div className="flex-center mb-[10px] gap-[20px]">
            {tokenA && !isNativeToken(tokenA) && (
              <Button
                className="flex-1"
                type="primary"
                size="large"
                disabled={isTokenAApproved}
                icon={isTokenBApproved ? <CheckCircleOutlined /> : null}
                loading={isTokenAApproving}
                onClick={approveTokenA}
              >
                {isTokenAApproved
                  ? t('common.approved', { name: `${tokenA?.symbol}` })
                  : t('common.approve.to', { name: `${tokenA?.symbol}` })}
              </Button>
            )}
            {tokenB && !isNativeToken(tokenB) && (
              <Button
                className="flex-1"
                type="primary"
                size="large"
                disabled={isTokenBApproved}
                loading={isTokenBApproving}
                icon={isTokenBApproved ? <CheckCircleOutlined /> : null}
                onClick={approveTokenB}
              >
                {isTokenBApproved
                  ? t('common.approved', { name: `${tokenB?.symbol}` })
                  : t('common.approve.to', { name: `${tokenB?.symbol}` })}
              </Button>
            )}
          </div>
        )}
        <WithAuthButton>
          <Button
            className="w-full"
            type="primary"
            size="large"
            disabled={disabled || !approvedAll}
            loading={loading}
            onClick={onCreate}
          >
            {t('dex.pools.create')}
          </Button>
        </WithAuthButton>
      </>
    );
  };

  return (
    <div className="mb-[60px] flex flex-1 flex-col items-center justify-center pt-[20px] max-md:px-[10px] max-md:pt-[20px]">
      <div className="mt-[30px] min-h-[420px] w-[500px] rounded-[20px]  bg-fill-niubi p-[20px] max-md:w-full max-md:px-[10px]">
        <Link
          to="/dex/liquidity"
          className="inline-block w-auto cursor-pointer  hover:text-theme"
        >
          <LeftOutlined />
          <span className="pl-[10px]">{t('dex.pools.create')}</span>
        </Link>
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
            totalPrice={0}
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
            totalPrice={0}
          />
        </div>
        <div className="mt-[20px] flex flex-col gap-[10px]">
          {renderAction()}
        </div>
      </div>
    </div>
  );
}

export default CreatePool;
