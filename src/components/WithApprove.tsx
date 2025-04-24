import { useTranslate } from '@/i18n';
import useApprove from '@/pages/dex/hooks/useApprove';
import { Token } from '@/types/swap';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PropsWithChildren } from 'react';
import { Address } from 'viem';

const WithApprove = ({
  token,
  amount,
  spenderAddress,
  children,
}: PropsWithChildren<{
  token: Token;
  amount: string;
  spenderAddress: string;
}>) => {
  const { t } = useTranslate();
  const { isApproved, loading, approve } = useApprove({
    token: token!,
    amount: amount,
    spenderAddress: spenderAddress as Address,
  });

  if (!isApproved) {
    return (
      <Button
        className="flex-1"
        type="primary"
        size="large"
        disabled={isApproved}
        icon={isApproved ? <CheckCircleOutlined /> : null}
        loading={loading}
        onClick={approve}
      >
        {t('common.approve.to', { name: `${token?.symbol}` })}
      </Button>
    );
  }

  return children;
};

export default WithApprove;
