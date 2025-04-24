import { CheckCircleOutlined, LeftOutlined } from '@ant-design/icons';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button } from 'antd';
import useApprove from '@/pages/dex/hooks/useApprove.ts';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { Address } from 'viem';
import { LiquidityReturnType } from '@/pages/dex/hooks/useAddLP.ts';
import useAddLPConfirm from '@/pages/dex/hooks/useAddLPConfirm.ts';
import { getPerAmount } from '@/pages/dex/liquidity/LiquidityInfo.tsx';
import { getAddress } from 'ethers';
import { useMemo } from 'react';
import { TokenIcon } from '@/components/icons';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { useTranslate } from '@/i18n';

const LPTokenItem = ({
  tokenB,
  tokenA,
  lpTokens,
  lpPairInfo,
}: Pick<
  LiquidityReturnType,
  'tokenB' | 'tokenA' | 'lpTokens' | 'lpPairInfo'
>) => {
  const sortedTokens = useMemo(
    () =>
      (lpPairInfo?.lpPair || []).map((address) =>
        [tokenA, tokenB].find(
          (token) =>
            getAddress(token?.address as Address).toLowerCase() ===
            getAddress(address).toLowerCase()
        )
      ),
    [lpPairInfo?.lpPair]
  );

  return (
    <div className="flex-center-between">
      <div className="text-[32px] font-bold">{lpTokens || 0}</div>
      <div className="flex-center gap-[10px] ">
        <div className="flex-center">
          <span className=" text-[24px]">
            <TokenIcon
              src={sortedTokens[0]?.icon}
              name={sortedTokens[0]?.symbol}
            />
          </span>
          <span className=" ml-[-5px] text-[24px]">
            <TokenIcon
              src={sortedTokens[1]?.icon}
              name={sortedTokens[1]?.symbol}
            />
          </span>
        </div>
        <div className="flex-center gap-[2px] text-[18px]">
          <span>{sortedTokens[0]?.symbol}</span>
          <span>/</span>
          <span>{sortedTokens[1]?.symbol}</span>
        </div>
      </div>
    </div>
  );
};

const ConfirmPanel = ({
  setStep,
  lpTokens,
  tokenA,
  tokenAAmount,
  tokenBAmount,
  tokenB,
  lpPairInfo,
  shareOfPool,
}: LiquidityReturnType) => {
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

  const { confirm, isSubmittedLoading } = useAddLPConfirm({
    tokenA,
    tokenB,
    tokenBAmount,
    tokenAAmount,
    lpPairInfo,
    setStep,
  });

  return (
    <div className="mt-[30px]  min-h-[420px] w-[500px] rounded-[20px]  bg-fill-niubi p-[20px] max-md:w-full max-md:px-[10px]">
      <a
        className="inline-block w-auto cursor-pointer  hover:text-theme"
        onClick={() => setStep('FILL')}
      >
        <LeftOutlined />
        <span className="pl-[10px]">{t('dex.liquidity.confirm')}</span>
      </a>
      <div className="mt-[20px]">
        <div className="flex-center-between text-tc-secondary">
          <span>{t('dex.liquidity.receive')}</span>
          <span>{t('dex.liquidity.tokens')}</span>
        </div>
        <div>
          <LPTokenItem
            tokenB={tokenB}
            tokenA={tokenA}
            lpTokens={lpTokens}
            lpPairInfo={lpPairInfo}
          />
        </div>
      </div>
      <div className="flex flex-col gap-[6px]  px-[10px] py-[20px] text-[14px]">
        <div className="flex-center-between">
          <span className="text-tc-secondary">
            {t('dex.liquidity.token.deposit', { name: `${tokenA?.symbol}` })}
          </span>
          <span>{tokenAAmount || 0}</span>
        </div>
        <div className="flex-center-between">
          <span className="text-tc-secondary">
            {t('dex.liquidity.token.deposit', { name: `${tokenB?.symbol}` })}
          </span>
          <span>{tokenBAmount || 0}</span>
        </div>
        <div className="flex-center-between">
          <span className="text-tc-secondary">
            {t('dex.liquidity.share.of.pool')}
          </span>
          <span>{shareOfPool || 0}%</span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-tc-secondary">{t('dex.liquidity.rates')}</span>
          <div className="flex flex-col items-end justify-end">
            <span>
              {`1 ${tokenA?.symbol} = ${getPerAmount(tokenAAmount, tokenBAmount)} ${tokenB?.symbol}`}
            </span>
            <span>
              {`1 ${tokenB?.symbol} = ${getPerAmount(tokenBAmount, tokenAAmount)} ${tokenA?.symbol}`}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-[20px] w-full">
        <WithAuthButton>
          <div>
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
            <Button
              className="w-full"
              type="primary"
              size="large"
              loading={isSubmittedLoading}
              disabled={!isTokenBApproved || !isTokenAApproved}
              onClick={confirm}
            >
              {t('common.confirm')}
            </Button>
          </div>
        </WithAuthButton>
      </div>
    </div>
  );
};

export default ConfirmPanel;
