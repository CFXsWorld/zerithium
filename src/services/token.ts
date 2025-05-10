import { tokens } from '@/tokens';

export const getTokenList = async () => {
  return {
    items: tokens,
  };
};
