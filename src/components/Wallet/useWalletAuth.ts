import { BUTTON_ACCESS } from '@/types/auth.ts';
import useEnv from '@/hooks/useEnv.ts';

const useWalletAuth = (
  access: BUTTON_ACCESS[] = [BUTTON_ACCESS.CONNECTED, BUTTON_ACCESS.CHAIN]
) => {
  const { CHAIN_ID } = useEnv();

  return {
    access,
    CHAIN_ID,
  };
};

export default useWalletAuth;
