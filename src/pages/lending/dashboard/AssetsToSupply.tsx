import LendingCard from '@/components/LendingCard.tsx';
import { Button, Checkbox } from 'antd';
import { ColumnType } from 'antd/es/table';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { LendingAsset } from '@/types/Lending.ts';
import { useEffect, useState } from 'react';
import DepositModal from '@/pages/lending/dashboard/DepositModal';
import ResponsiveTable from '@/components/ResponsiveTable.tsx';
import TokenWithIcon from '@/components/TokenWithIcon.tsx';
import AmountWithPrice from '@/components/AmountWithPrice.tsx';
import { useTranslate } from '@/i18n';

const AssetsToSupply = ({
  assets,
  loading,
  health,
  refetch,
}: {
  assets: LendingAsset[];
  loading: boolean;
  health: number;
  refetch: () => void;
}) => {
  const [filteredAssets, setFilteredAssets] = useState<LendingAsset[]>([]);
  const [checked, setChecked] = useState(false);
  const [depositItem, setDepositItem] = useState<LendingAsset>();

  useEffect(() => {
    if (!checked) {
      setFilteredAssets(assets.filter((item) => item.erc20Balance !== 0));
    } else {
      setFilteredAssets(assets);
    }
  }, [checked, assets]);

  const { t } = useTranslate();

  const columns: ColumnType<LendingAsset>[] = [
    {
      title: t('lending.asset'),
      dataIndex: 'asset',
      render: (_: string, record: LendingAsset) => {
        return <TokenWithIcon token={record.token} />;
      },
    },
    {
      title: t('lending.wallet.balance'),
      dataIndex: 'balance',
      render: (_: string, record: LendingAsset) => {
        return (
          <AmountWithPrice
            amount={record?.erc20Balance}
            price={record?.erc20TotalPrice}
          />
        );
      },
    },
    {
      title: t('lending.apy'),
      dataIndex: 'apy',
      render: (_: string, record: LendingAsset) => {
        return (
          <div className="flex flex-col gap-[5px]">
            <span>{record?.depositInterest}%</span>
          </div>
        );
      },
    },
    {
      title: t('lending.collateral'),
      dataIndex: 'canCollateral',
      align: 'center',
      render: (canCollateral: boolean) => {
        return canCollateral ? (
          <CheckCircleOutlined className="text-status-success" />
        ) : (
          <CloseCircleOutlined className="text-status-error" />
        );
      },
    },
    {
      dataIndex: 'action',
      align: 'right',
      render: (_: string, record: LendingAsset) => {
        return (
          <div className="flex  items-center justify-end gap-[5px] max-md:justify-start">
            <Button
              type="primary"
              className="rounded-[8px] text-[12px] max-md:h-[32px] max-md:flex-1 max-md:rounded-[16px]"
              size="small"
              onClick={() => {
                setDepositItem(record);
              }}
              disabled={!record.canCollateral || !record.erc20Balance}
            >
              {t('lending.supply')}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <LendingCard
      loading={loading}
      title={t('lending.assets.supply')}
      description={
        <div className="flex items-center gap-[5px]">
          <label htmlFor="chckbox" className="flex items-center">
            <Checkbox
              id="chckbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
            <span className="cursor-pointer select-none pl-[10px]">
              {t('lending.show.zero.balance')}
            </span>
          </label>
        </div>
      }
    >
      {depositItem && (
        <DepositModal
          asset={depositItem}
          onClose={() => {
            setDepositItem(undefined);
          }}
          refresh={() => {
            refetch();
            setDepositItem(undefined);
          }}
          userHealthFactor={health}
        />
      )}

      <ResponsiveTable
        columns={columns}
        dataSource={filteredAssets}
        size="middle"
        rowKey="id"
      />
    </LendingCard>
  );
};

export default AssetsToSupply;
