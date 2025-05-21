import { ChainType } from '@/types/chain.ts';
import { CHAINS } from '@/contracts/chains.tsx';
import { Dropdown, MenuProps } from 'antd';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { cn } from '@/utils/classnames.ts';
import { useTranslate } from '@/i18n';

const chains: ChainType[] = [CHAINS.zeroGTest];

const ChainSelector = () => {
  const chainId = 16601;
  const [open, setOpen] = useState(false);

  const { t } = useTranslate();

  const chain = chains.find((item) => item.chainId === chainId);

  const items: MenuProps['items'] = chains.map((item) => ({
    key: item.chainId,
    label: (
      <div className="flex items-center justify-start gap-[10px]">
        <span className="text-[20px]">{item.icon}</span>
        <span className="text-[16px]">{item.name}</span>
      </div>
    ),
  }));
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'title',
            label: (
              <div className="hover:cursor-auto">
                {t('lending.market.select')}
              </div>
            ),
            disabled: true,
          },
          ...items,
        ],
      }}
      placement="bottom"
      onOpenChange={setOpen}
      trigger={['click']}
    >
      <div className="flex cursor-pointer items-center gap-[10px]">
        <div className="flex-center gap-[10px]">
          <span className="text-[40px]">{chain?.icon}</span>
          <span className="text-[18px] font-bold">{chain?.name}</span>
        </div>
        <DownOutlined
          className={cn(
            'rotate-0 text-[14px] font-bold transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]',
            { 'rotate-180': open }
          )}
        />
      </div>
    </Dropdown>
  );
};
export default ChainSelector;
