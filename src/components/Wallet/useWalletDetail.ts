import { useMemo } from 'react';
import { formatCurrency } from '@/utils';
import useTokensWithPrice from '@/hooks/useTokensWithPrice.ts';

const useWalletDetail = () => {
  const { tokens, loading, isTokenLoading } = useTokensWithPrice();

  const totalPrice = useMemo(() => {
    const sum = (tokens || []).reduce(
      (prev, next) => prev + (next?.price || 0),
      0
    );
    return formatCurrency(sum, true);
  }, [tokens]);

  return {
    isTokenLoading,
    tokens,
    loading,
    totalPrice,
  };
};

export default useWalletDetail;
