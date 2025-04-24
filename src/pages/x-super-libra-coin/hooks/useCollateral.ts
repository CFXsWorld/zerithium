import { useEffect, useMemo, useState } from 'react';
import useMulticall, { ContractCall } from '@/hooks/useMulticall.ts';
import { useAccount, useReadContract } from 'wagmi';
import { Address, erc20Abi } from 'viem';
import { useMutation } from '@tanstack/react-query';
import { getTokenList } from '@/services/slc.ts';
import { formatUnits } from 'ethers';
import { BorrowModeType, SLCAsset } from '@/types/slc.ts';
import { formatNumber } from '@/hooks/useErc20Balance.ts';
import { ZERITHIUM_SLC_CONTRACT } from '@/contracts';
import useNativeToken from '@/hooks/useNativeToken.ts';

const useCollateral = () => {
  const { multiCall } = useMulticall();
  const { address } = useAccount();
  const [assets, setAssets] = useState<SLCAsset[]>();

  const [allUnitPrice, setAllUnitPrices] = useState<[string, number][]>();

  const { getRealAddress, isNativeToken, getNativeTokenBalance } =
    useNativeToken();
  const { data: assetsOverview } = useReadContract({
    address: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SLC_CONTRACT.interface.abi,
    functionName: 'userAssetOverview',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  const { data: userMode } = useReadContract({
    address: ZERITHIUM_SLC_CONTRACT.interface.address as Address,
    abi: ZERITHIUM_SLC_CONTRACT.interface.abi,
    functionName: 'userMode',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });
  const { mutate, isPending: loading } = useMutation({
    mutationFn: getTokenList,
    onSuccess: (data) => {
      setAssets(data?.items || []);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  useEffect(() => {
    if (assetsOverview) {
      const tokens = (assetsOverview as string[][])[0];
      const calls: ContractCall[] = tokens.map((address) => ({
        name: 'getPrice',
        abi: ZERITHIUM_SLC_CONTRACT.oracle.abi,
        address: ZERITHIUM_SLC_CONTRACT.oracle.address as Address,
        values: [address],
      }));
      multiCall(calls).then((allUnitPrice) => {
        setAllUnitPrices(
          tokens.map((adds, index) => [
            adds,
            Number(formatUnits(allUnitPrice.returnData[index])),
          ])
        );
      });
    }
  }, [assetsOverview]);

  useEffect(() => {
    if (assets?.length && address && allUnitPrice) {
      const calls: ContractCall[] = assets.map((item) => ({
        name: 'balanceOf',
        abi: erc20Abi,
        address: getRealAddress(item),
        values: [address],
      }));

      multiCall(calls).then(async (allBalance) => {
        const newData = [];
        for (let index = 0; index < assets.length; index++) {
          const item = assets[index];
          const unitPrice =
            allUnitPrice?.find(
              (n) => n[0].toLowerCase() === item.address.toLowerCase()
            )?.[1] || 0;
          if (isNativeToken(item)) {
            const balance = await getNativeTokenBalance();
            newData.push({
              ...item,
              balance: formatNumber(balance, 6),
              balancePrice: formatNumber(balance * unitPrice, 6),
            });
          } else {
            newData.push({
              ...item,
              balance: formatNumber(
                Number(formatUnits(allBalance.returnData[index])),
                6
              ),
              balancePrice: formatNumber(
                Number(formatUnits(allBalance.returnData[index])) * unitPrice,
                6
              ),
            });
          }
        }

        setAssets(newData);
      });
    }
  }, [assets?.length, address, allUnitPrice]);

  const assetsWithPrices = useMemo(() => {
    const mode = (userMode as number[])?.[0];
    return (assets || []).map((item) => {
      const AllTokens = (assetsOverview as string[][])?.[0] || [];
      const AllProvided = (assetsOverview as bigint[][])?.[1] || [];
      const index = AllTokens.findIndex(
        (adds) => adds.toLowerCase() === item.address.toLowerCase()
      );

      const provided = AllProvided[index]
        ? Number(formatUnits(AllProvided[index]))
        : 0;

      const userModeAsset = (userMode as string[])?.[1];

      const unitPrice =
        allUnitPrice?.find(
          (n) => n[0].toLowerCase() === item.address.toLowerCase()
        )?.[1] || 0;

      let canBeProvided = item.max_deposit_amount !== '0';

      if (mode === BorrowModeType?.HighLiquidity) {
        canBeProvided = item.max_deposit_amount === '0';
      }

      if (mode === BorrowModeType?.RiskIsolation) {
        canBeProvided =
          item.address.toLowerCase() === userModeAsset.toLowerCase();
      }

      return {
        ...item,
        provided: formatNumber(provided, 6),
        providedPrice: formatNumber(provided * unitPrice, 6),
        canBeProvided,
        canBeWithdraw: formatNumber(provided, 6) > 0,
      };
    });
  }, [assets, allUnitPrice, assetsOverview, userMode]);

  return {
    assets: assetsWithPrices,
    loading,
    isAssetsLoading: false,
  };
};

export default useCollateral;
