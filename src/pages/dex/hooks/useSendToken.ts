import { useEffect, useMemo, useState } from 'react';
import { Token } from '@/types/swap.ts';
import useErc20Balance, { formatNumber } from '@/hooks/useErc20Balance.ts';
import usePair from '@/pages/dex/hooks/usePair.ts';
import { ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import useLP from '@/pages/dex/hooks/useLP.ts';
import { isNumeric } from '@/utils/isNumeric.ts';
import { useAccount, useReadContract } from 'wagmi';
import { Address, erc20Abi, isAddress } from 'viem';
import { Form } from 'antd';
import useCISContract from '@/hooks/useCISContract.ts';
import { parseUnits } from 'ethers';
import useNativeToken from '@/hooks/useNativeToken.ts';
import useXSendTransaction from '@/hooks/useXSendTransaction.ts';
import useXWriteContract from '@/hooks/useXWriteContract.ts';
import useSetDefaultToken from '@/hooks/useSetDefaultToken';

const useSendToken = () => {
  const { getBalance } = useErc20Balance();
  const [inputToken, setInputToken] = useState<Token | undefined>();
  const [payAmount, setPayAmount] = useState<string>('');
  const [inputOwnerAmount, setInputOwnerAmount] = useState(0);
  const [inputTokenTotalPrice, setInputTokenTotalPrice] = useState(0);

  const account = useAccount();
  const [form] = Form.useForm();
  const { getAddrByCISId } = useCISContract();
  const cis = Form.useWatch('address', form);
  const [cisAddress, setCisAddress] = useState<string>();

  const { isNativeToken, getRealAddress, getNativeTokenBalance } =
    useNativeToken();

  const { sendTransactionAsync, isSubmittedLoading: isSubmittedLoadingSend } =
    useXSendTransaction({});
  const { writeContractAsync, isSubmittedLoading } = useXWriteContract({});

  const { data: decimals } = useReadContract({
    address: getRealAddress(inputToken!) as Address,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  useSetDefaultToken('token', setInputToken);

  useEffect(() => {
    setCisAddress('');
    if (cis && !isAddress(cis)) {
      getAddrByCISId(cis).then((res) => {
        if (res) {
          setCisAddress(res);
        }
      });
    }
  }, [cis]);

  const { pairAddress: fromWithSLCPairAddress } = usePair({
    fromToken: inputToken,
    toToken: { address: ZERITHIUM_SWAP_CONTRACT.slc.address },
  });
  const { getLpPrice } = useLP();

  useEffect(() => {
    if (fromWithSLCPairAddress && payAmount) {
      getLpPrice(fromWithSLCPairAddress).then((unitPrice) => {
        setInputTokenTotalPrice(formatNumber(Number(payAmount) * unitPrice, 2));
      });
    }
  }, [fromWithSLCPairAddress, payAmount]);

  useEffect(() => {
    if (inputToken?.address) {
      if (isNativeToken(inputToken)) {
        getNativeTokenBalance().then(setInputOwnerAmount);
      } else {
        getBalance(inputToken.address).then(setInputOwnerAmount);
      }
    }
  }, [inputToken]);
  const isInsufficient = useMemo(() => {
    return !!(
      inputToken?.address &&
      isNumeric(payAmount) &&
      Number(payAmount) > Number(inputOwnerAmount)
    );
  }, [payAmount, inputOwnerAmount, inputToken?.address]);

  const confirm = () => {
    if ((isAddress(cis) || !!cisAddress) && decimals && account.address) {
      const toAddress = cis || cisAddress;

      if (isNativeToken(inputToken!)) {
        sendTransactionAsync({
          to: toAddress,
          value: parseUnits(payAmount, decimals),
        }).then((res) => {
          console.log(res);
        });
      } else {
        writeContractAsync({
          address: inputToken?.address as Address,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [toAddress, parseUnits(payAmount, decimals)],
        });
      }
    }
  };

  return {
    confirm,
    inputToken,
    setInputToken,
    payAmount,
    setPayAmount,
    inputOwnerAmount,
    inputTokenTotalPrice,
    isInsufficient,
    cisAddress,
    form,
    getAddrByCISId,
    cis,
    isSubmittedLoading: isSubmittedLoading || isSubmittedLoadingSend,
  };
};

export default useSendToken;
