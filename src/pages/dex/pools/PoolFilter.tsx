import { cn } from '@/utils/classnames.ts';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslate } from '@/i18n';

const PoolFilter = ({
  poolType,
  onPoolChange,
}: {
  poolType: string;
  onPoolChange: (value: string) => void;
}) => {
  const { t } = useTranslate();
  const tabs = [
    {
      label: t('dex.pools.tab.all'),
      value: '0',
    },
    {
      label: t('dex.pools.tab.my'),
      value: '1',
    },
  ];

  return (
    <div className="flex-center-between mb-[20px] mt-[32px]">
      <div className="flex-center gap-[20px] max-md:gap-[10px]">
        {(tabs || []).map((tab) => (
          <div
            key={tab.value}
            onClick={() => {
              onPoolChange(tab.value);
            }}
            className={cn(
              'flex-center h-[40px] gap-[12px] rounded-[20px] px-[16px] max-md:gap-[6px] ',
              poolType === tab.value
                ? 'pointer-events-none bg-theme-non-opaque text-theme'
                : 'cursor-pointer hover:bg-theme-non-opaque hover:text-theme '
            )}
          >
            <span className="max-md:text-[14px]">{tab.label}</span>
          </div>
        ))}
      </div>
      <div className="w-[300px] pl-[20px] max-md:w-auto max-md:flex-1">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('dex.swap.token.modal.search.placeholder')}
          className="rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default PoolFilter;
