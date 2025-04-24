import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslate } from '@/i18n';

const AssetsFilter = ({ onChange }: { onChange: (value: string) => void }) => {
  const { t } = useTranslate();
  return (
    <div className="flex-center-between mb-[20px] mt-[32px]">
      <div className="flex-center gap-[40px]">{t('lending.market.assets')}</div>
      <div className="w-[300px]">
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('common.placeholder.search.name')}
          className="rounded-[20px]"
          onBlur={(e) => {
            onChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default AssetsFilter;
