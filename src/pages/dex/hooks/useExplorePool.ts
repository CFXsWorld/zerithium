import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { getPairTokens } from '@/services/explore';

const useExplorePool = () => {
  const [listType, setListType] = useState<'trade' | 'liquidity'>('trade');
  const params = useParams<{ address: string }>();
  const pairAddress = params.address;
  const navigate = useNavigate();

  const { data, mutate, isPending } = useMutation({
    mutationFn: getPairTokens,
  });

  useEffect(() => {
    if (pairAddress) {
      mutate({ pairs: pairAddress });
    }
  }, [pairAddress]);

  return {
    pool: data?.items?.[0],
    navigate,
    listType,
    setListType,
    isPending,
    pairAddress,
  };
};

export default useExplorePool;
