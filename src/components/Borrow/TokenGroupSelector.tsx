import { Popover, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { cn } from '@/utils/classnames.ts';
import { SpinIcon, TokenIcon } from '@/components/icons';
import { useState } from 'react';
import useTokenGroupAssets from '@/components/Borrow/useTokenGroupAssets.ts';
import { LendingAsset } from '@/types/Lending.ts';
import { useTranslate } from '@/i18n';

const TokenGroupSelector = ({
  value,
  onChange,
}: {
  value?: LendingAsset[];
  onChange: (assets: LendingAsset[]) => void;
}) => {
  const { assets, isPending } = useTokenGroupAssets();

  const [open, onOpen] = useState(false);

  const { t } = useTranslate();
  const renderGroupAsset = (assets: LendingAsset[]) => {
    return (
      <div className="flex">
        {assets.map((asset, index) => (
          <div
            key={asset.token?.symbol}
            className="flex items-center gap-[4px]"
          >
            <div className="flex h-full w-[20px] items-center">
              <TokenIcon
                src={asset?.token.icon}
                width={20}
                height={20}
                name={asset?.token?.symbol}
              />
            </div>
            <div className="flex  flex-1  items-center">
              <span className="text-[12px] text-tc-secondary">
                {asset.token.symbol}
              </span>
            </div>
            {index !== assets.length - 1 && (
              <span className="px-[4px] text-tc-secondary">/</span>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <Popover
      placement="bottom"
      open={open}
      onOpenChange={onOpen}
      content={
        <Spin spinning={isPending} indicator={<SpinIcon />}>
          <div className="h-[250px] w-[450px] overflow-y-auto">
            <div className="my-[10px] flex flex-col gap-[10px]">
              {(assets || []).map((item, index) => (
                <div
                  className={cn(
                    'flex cursor-pointer flex-col gap-[10px] rounded-[12px]  px-[10px] py-[10px]',
                    'hover:bg-theme-non-opaque hover:opacity-75'
                  )}
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onChange(item);
                    onOpen(false);
                  }}
                >
                  <span className="text-tc-secondary">
                    {t('lending.borrow.mode.homogenous.group')} {index + 1}
                  </span>
                  {renderGroupAsset(item)}
                </div>
              ))}
            </div>
          </div>
        </Spin>
      }
      arrow={false}
      trigger={['click']}
    >
      <div
        className="flex h-[62px] cursor-pointer justify-between rounded-[12px] bg-fill-niubi2 px-[16px]"
        onClick={() => {
          onOpen(true);
        }}
      >
        <div className="flex items-center text-[14px] text-tc-secondary">
          {t('lending.borrow.mode.homogenous.input.label')}
        </div>
        <div className="flex-center gap-[5px]">
          {value?.length ? (
            <div className="flex-center mr-[20px]">
              {renderGroupAsset(value)}
            </div>
          ) : (
            <span className="text-[16px]">
              {t('lending.borrow.mode.homogenous.input.select')}
            </span>
          )}
          <DownOutlined className="text-[14px]" />
        </div>
      </div>
    </Popover>
  );
};

export default TokenGroupSelector;
