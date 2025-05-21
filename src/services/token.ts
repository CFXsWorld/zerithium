import { tokens } from '@/services/data/tokens';

export const getTokenList = async () => {
  return {
    items: tokens,
  };
};
