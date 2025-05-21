import Header from '@/components/Header';
import { getTokenList } from '@/services/token';
import useTokenStore from '@/store/tokens';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const PageLayout = () => {
  const updateTokens = useTokenStore((state) => state.updateTokens);
  const { mutateAsync } = useMutation({
    mutationKey: ['global-token-list'],
    mutationFn: () => getTokenList(),
  });

  useEffect(() => {
    mutateAsync().then((res) => {
      updateTokens(res.items || []);
    });
  }, []);
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default PageLayout;
