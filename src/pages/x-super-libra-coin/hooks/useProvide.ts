import useXWriteContract from '@/hooks/useXWriteContract.ts';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import { Address, erc20Abi } from 'viem';
import { SLCAsset } from '@/types/slc.ts';
import useNativeToken from '@/hooks/useNativeToken.ts';
import { useEffect, useMemo, useState } from 'react';
import { isNumeric } from '@/utils/isNumeric.ts';
import useErc20Balance from '@/hooks/useErc20Balance.ts';
import useTokenPrice from '@/hooks/useTokenPrice.ts';
import { useReadContract } from 'wagmi';
import { parseUnits } from 'ethers';

const useProvide = ({
  token,
  refresh,
}: {
  token?: SLCAsset;
  refresh: () => void;
}) => {
  const inputToken = token;
  const [payAmount, setPayAmount] = useState<string>('');
  const { getBalance } = useErc20Balance();
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const { isNativeToken, getRealAddress, getNativeTokenBalance } =
    useNativeToken();
  const { totalPrice: inputTokenTotalPrice } = useTokenPrice({
    amount: payAmount,
    address: token?.address,
  });

  const { writeContractAsync, isSubmittedLoading, loading } = useXWriteContract(
    {
      onWriteSuccess: refresh,
    }
  );

  const { data: decimals } = useReadContract({
    address: getRealAddress(inputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!inputToken,
    },
  });

  useEffect(() => {
    if (inputToken?.address) {
      if (isNativeToken(inputToken)) {
        getNativeTokenBalance().then(setInputOwnerAmount);
      } else {
        getBalance(inputToken.address).then(setInputOwnerAmount);
      }
    }
  }, [inputToken]);

  const provideNormal = async () => {
    if (decimals) {
      const amountIn = parseUnits(payAmount, decimals);
      const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'licensedAssetsPledge',
        args: [inputToken?.address as Address, amountIn],
      });
    }
  };

  const provideCFX = async () => {
    if (decimals) {
      const { address, abi } = ZERITHIUM_SLC_CONTRACT.interface;
      writeContractAsync({
        address: address as Address,
        abi,
        functionName: 'CFXPledge',
        value: parseUnits(payAmount, decimals),
        args: [],
      });
    }
  };

  const provide = () => {
    if (isNativeToken(token!)) {
      provideCFX();
    } else {
      provideNormal();
    }
  };

  const isInsufficient = useMemo(() => {
    return isNumeric(payAmount) && Number(payAmount) > Number(inputOwnerAmount);
  }, [payAmount, inputOwnerAmount]);

  return {
    provide,
    inputToken,
    payAmount,
    setPayAmount,
    isInsufficient,
    inputOwnerAmount,
    isSubmittedLoading,
    loading,
    inputTokenTotalPrice,
  };
};

export default useProvide;
