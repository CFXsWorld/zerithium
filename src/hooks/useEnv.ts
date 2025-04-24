const useEnv = () => {
  // const env = import.meta.env.VITE_APP_ENV || 'testnet';
  const env = import.meta.env.VITE_APP_ENV || 'mainnet';
  const isMainnet = env === 'mainnet';

  return {
    isMainnet,
    CHAIN_ID: isMainnet ? 16600 : 71,
  };
};

export default useEnv;
