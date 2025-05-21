import { request } from '@/services/request.ts';
import { ResponseType, ListType } from '@/types/common.ts';
import { LendingAsset, LendingAssetInterest } from '@/types/Lending.ts';
import { tokens } from '@/services/data/tokens';

const generageLendingAssets = (): LendingAsset[] => {
  return tokens.map((token) => ({
    token,
    max_ltv: '0',
    liq_penalty: '0',
    max_lending_amount_inrim: '0',
    best_lending_ratio: '0',
    lending_mode_num: '0',
    homogeneous_mode_ltv: '0',
    best_deposit_interest_rate: '0',
    id: token.address,
  }));
};

export const getLendingAssets = async () => {
  return { items: generageLendingAssets() };
};

export const getLendingTokenGroup = async () => {
  return request
    .get<ResponseType<ListType<LendingAsset[]>>>('/lending/group')
    .then((res) => res.data?.data);
};

export const getAssetInterest = async (params: { token: string }) => {
  return request
    .get<
      ResponseType<ListType<LendingAssetInterest>>
    >('/deposit_loan_interest', { params })
    .then((res) => res.data?.data);
};
