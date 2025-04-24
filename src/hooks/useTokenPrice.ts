import { useReadContract } from 'wagmi';
import { ZERITHIUM_SLC_CONTRACT, ZERITHIUM_SWAP_CONTRACT } from '@/contracts';
import { Address } from 'viem';
import { useMemo } from 'react';
import { formatUnits } from 'ethers';

const useTokenPrice = ({
  amount,
  address = ZERITHIUM_SWAP_CONTRACT.slc.address,
}: {
  amount: string;
  address?: string;
}) => {
  const { data: slcUnitPrice } = useReadContract({
    address: ZERITHIUM_SLC_CONTRACT.oracle.address as Address,
    abi: ZERITHIUM_SLC_CONTRACT.oracle.abi,
    functionName: 'getPrice',
    args: [address!],
  });

  const unitPrice = useMemo(() => {
    if (slcUnitPrice) {
      return Number(formatUnits(slcUnitPrice as bigint, 18));
    }
    return 0;
  }, [slcUnitPrice]);

  const totalPrice = useMemo(() => {
    if (unitPrice && amount) {
      return Number(amount) * unitPrice;
    }
    return 0;
  }, [amount, unitPrice]);
  return {
    slcUnitPrice,
    totalPrice,
  };
};

export default useTokenPrice;
