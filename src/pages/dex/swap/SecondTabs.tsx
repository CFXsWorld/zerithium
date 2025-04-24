import { useTranslate } from '@/i18n';
import { cn } from '@/utils/classnames.ts';

const SecondTabs = ({
  active,
  onChange,
}: {
  active: 'swap' | 'limit' | 'send';
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslate();

  const tabs = [
    { name: t('dex.swap.title'), value: 'swap' },
    // {
    //   name: t('dex.limit.title'),
    //   value: 'limit',
    // },
    {
      name: t('dex.send.title'),
      value: 'send',
    },
  ];

  return (
    <div className="flex-center gap-[10px]">
      {(tabs || []).map((tab) => (
        <div
          key={tab.name}
          onClick={() => {
            onChange(tab.value);
          }}
          className={cn(
            'flex-center h-[36px] rounded-[20px]  px-[16px] ',
            active === tab.value
              ? 'pointer-events-none bg-fill-primary  '
              : 'cursor-pointer text-tc-secondary hover:bg-fill-primary '
          )}
        >
          <span>{tab.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SecondTabs;
