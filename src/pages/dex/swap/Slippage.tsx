import { Input, Popover, Tooltip } from 'antd';
import { SettingIcon } from '@/components/icons';
import { QuestionCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { cn } from '@/utils/classnames.ts';
import { useTranslate } from '@/i18n';

export const SlippageValue = ({ value }: { value: number }) => {
  const { t } = useTranslate();
  if (value === -1) {
    return <span className="text-tc-secondary">0.5%</span>;
  }
  if (value > 1) {
    return (
      <div className="flex-center gap-[2px] text-status-warning">
        <WarningOutlined />
        <span>{value}%</span>
        <span>·</span>
        <span>{t('dex.swap.custom')}</span>
      </div>
    );
  }
  return <span className="text-tc-secondary">{value}%</span>;
};

const SlippageSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const { t } = useTranslate();
  const presets = [
    {
      label: t('dex.swap.auto'),
      value: -1,
    },
    {
      label: '0.1%',
      value: 0.1,
    },
    {
      label: '1%',
      value: 1,
    },
  ];
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex-center-between">
        <div className="flex items-center gap-[10px]">
          <span>{t('dex.swap.slippage.tolerance')}</span>
          <Tooltip title={t('dex.swap.slippage.tolerance.tip')} placement="top">
            <QuestionCircleOutlined className="cursor-pointer text-tc-secondary" />
          </Tooltip>
        </div>
        <SlippageValue value={Number(value || 0)} />
      </div>
      <div className="flex  flex-nowrap items-center gap-[10px] ">
        {presets.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex h-[32px] cursor-pointer items-center justify-center rounded-[6px] border border-line-primary px-[12px] text-[12px]',
              {
                'border-transparent bg-theme text-white':
                  Number(value || 0) === item.value,
              }
            )}
            onClick={() => {
              onChange(String(item.value));
            }}
          >
            <span style={{ minWidth: 30, textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        ))}
        <Input
          suffix={t('dex.swap.custom')}
          value={Number(value || 0) > 1 ? value : undefined}
          placeholder="0.5"
          onChange={(e) => {
            let value = e.target.value;
            value = value.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) {
              value = `${parts[0]}.${parts.slice(1).join('')}`;
            }
            if (
              value.startsWith('0') &&
              value.length > 1 &&
              !value.startsWith('0.')
            ) {
              value = value.replace(/^0+/, '');
            }
            onChange(value);
          }}
        />
      </div>
    </div>
  );
};

const Slippage = ({
  value,
  onChange,
  deadline,
  onDeadlineChange,
}: {
  deadline: string;
  onDeadlineChange: (v: string) => void;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslate();
  return (
    <Popover
      content={
        <div className="min-h-[160px] max-md:w-[290px] md:w-[400px]">
          <div className="mt-[20px] flex flex-col gap-[10px]">
            <SlippageSelector value={value} onChange={onChange} />
            <div className="flex items-center gap-[10px]">
              <span>{t('dex.swap.transaction.deadline')}</span>
              <Tooltip
                title={t('dex.swap.transaction.deadline.tip')}
                placement="top"
              >
                <QuestionCircleOutlined className="cursor-pointer text-tc-secondary" />
              </Tooltip>
            </div>
            <div>
              <Input
                value={deadline}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^0-9]/g, '');
                  if (value.startsWith('0') && value.length > 1) {
                    value = value.replace(/^0+/, '');
                  }
                  onDeadlineChange(value);
                }}
                suffix={t('dex.swap.minutes')}
              />
            </div>
          </div>
        </div>
      }
      trigger={['click']}
      placement="bottomRight"
    >
      <div className={cn('flex-center gap-[5px] ')}>
        <span className="text-[14px] text-tc-secondary">
          {Number(value || 0) > 0 ? `${value}%` : `${t('dex.swap.auto')}(0.5%)`}
        </span>
        <SettingIcon className="cursor-pointer hover:text-theme" />
      </div>
    </Popover>
  );
};

export default Slippage;
