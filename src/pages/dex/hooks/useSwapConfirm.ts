import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { SwapRoute, Token } from '@/types/swap.ts';
import dayjs from 'dayjs';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { parseUnits } from 'ethers';
import { WriteContractMutateAsync } from '@wagmi/core/query';

const useSwapConfirm = ({
  inputToken,
  payAmount,
  deadline,
  slippage,
  receiveAmount,
  outputToken,
  router,
  writeContractAsync,
}: {
  inputToken?: Token;
  outputToken?: Token;
  payAmount: string;
  receiveAmount: string;
  slippage: string;
  deadline: string;
  router?: SwapRoute;
  writeContractAsync: WriteContractMutateAsync<any>;
}) => {
  const { isNativeToken, getRealAddress } = useNativeToken();

  const { data: fromDecimals } = useReadContract({
    address: getRealAddress(inputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const { data: toDecimals } = useReadContract({
    address: getRealAddress(outputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const confirm = () => {
    if (fromDecimals && toDecimals && router?.route.length) {
      const { address, abi } = ZERITHIUM_SWAP_CONTRACT.interface;

      let value = 0n;

      const amountIn = parseUnits(payAmount, fromDecimals);
      const amountOut = parseUnits(receiveAmount, toDecimals);

      const rate =
        Number(slippage === '-1' ? '0.5' : slippage) *
        Number(receiveAmount) *
        0.01;

      const limits = parseUnits(rate.toFixed(8), 18);
      const date = dayjs().add(Number(deadline), 'minute').unix() + 100;

      if (isNativeToken(inputToken!)) {
        value = amountIn;
      }

      const routes = router.route;

      const routePath = routes.map((item, index) => {
        if (index === 0 || index === routes.length - 1) {
          return getRealAddress(item);
        }
        return item.address;
      });

      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'xexchange2',
        args: [routePath, amountIn, amountOut, limits, date],
        value: `${value}` as unknown as bigint,
      });
    }
  };

  return {
    confirm,
  };
};

export default useSwapConfirm;
