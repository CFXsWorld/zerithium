import { Token } from '@/types/swap';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSetToken from '@/hooks/useSetToken';

const useExploreToken = () => {
  const [receiveToken, setToken] = useState<Token>();

  const [listType, setListType] = useState<'trade' | 'liquidity'>('trade');
  const params = useParams<{ address: string }>();
  const tokenAddress = params.address;
  const navigate = useNavigate();
  const { loading } = useSetToken(tokenAddress || '', setToken);

  return {
    loading,
    navigate,
    listType,
    setListType,
    receiveToken,
    tokenAddress,
  };
};

export default useExploreToken;
