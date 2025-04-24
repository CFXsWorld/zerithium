import { Button, Divider, Input, Modal, Spin } from 'antd';
import { useState } from 'react';
import { DownOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { cn } from '@/utils/classnames.ts';
import { Token } from '@/types/swap.ts';
import { SpinIcon, TokenIcon } from '@/components/icons';
import useAddToken from '@/hooks/useAddToken.ts';
import useTokensWithPrice from '@/hooks/useTokensWithPrice.ts';
import { useTranslate } from '@/i18n';

const ModalContent = ({
  value,
  disabledToken,
  onChange,
  onOpen,
}: {
  value?: Token;
  onChange: (value: Token) => void;
  disabledToken?: Token;
  disabled?: boolean;
  onOpen: (v: boolean) => void;
}) => {
  const {
    tokens: recommends,
    loading,
    isTokenLoading: isPending,
    getTokens,
  } = useTokensWithPrice();
  const { addToken } = useAddToken();

  const { t } = useTranslate();

  return (
    <div className="h-[600px] overflow-y-auto">
      <div className="mb-[20px] text-[14px] text-tc-secondary">
        {t('dex.swap.token.modal.description')}
      </div>
      <Input
        prefix={<SearchOutlined />}
        placeholder={t('dex.swap.token.modal.search.placeholder')}
        className="rounded-[20px]"
        onBlur={(e) => {
          getTokens({
            pageNum: 1,
            pageSize: 50,
            nameOrAddress: e.target.value,
          });
        }}
      />
      <Spin indicator={<SpinIcon />} spinning={isPending}>
        <div className="my-[20px] flex flex-wrap gap-[20px]">
          {(recommends || []).slice(0, 6).map((item) => (
            <div
              className={cn(
                'flex-center  h-[32px] cursor-pointer gap-[10px] rounded-[20px] border-2  border-solid px-[16px]',
                'hover:border-transparent hover:bg-fill-primary',
                {
                  'border-transparent bg-fill-primary':
                    item.symbol === value?.symbol,
                  'cursor-not-allowed opacity-75':
                    disabledToken?.symbol === item.symbol,
                }
              )}
              key={item.symbol}
              onClick={() => {
                if (disabledToken?.symbol !== item.symbol) {
                  onChange(item);
                  onOpen(false);
                }
              }}
            >
              <TokenIcon src={item.icon} name={item?.symbol} />
              {item.symbol}
            </div>
          ))}
        </div>
        <Divider />
        <div className="my-[10px] flex flex-col gap-[5px] ">
          {(recommends || []).map((item) => (
            <div
              className={cn(
                'flex-center cursor-pointer gap-[10px] rounded-[12px] px-[10px]',
                {
                  'cursor-not-allowed  bg-fill-niubi opacity-45':
                    disabledToken?.symbol === item.symbol,
                },
                {
                  'hover:bg-theme-non-opaque hover:opacity-75':
                    disabledToken?.symbol !== item.symbol,
                }
              )}
              key={item.symbol}
              onClick={() => {
                if (disabledToken?.symbol !== item.symbol) {
                  onChange(item);
                  onOpen(false);
                }
              }}
            >
              <div className="h-full w-[36px] text-[36px]">
                <TokenIcon
                  src={item.icon}
                  width={36}
                  height={36}
                  name={item?.symbol}
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-[14px]"> {item.name}</span>
                <span className="text-[12px] text-tc-secondary">
                  {item.symbol}
                </span>
              </div>
              <div
                className="flex items-center gap-[20px]"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span>
                  {loading ? <SpinIcon /> : <span>{item.amount}</span>}
                </span>
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    addToken(item);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

const TokenSelector = ({
  value,
  onChange,
  disabledToken,
  disabled,
  showDropArrow = true,
}: {
  value?: Token;
  onChange: (value: Token) => void;
  disabledToken?: Token;
  disabled?: boolean;
  showDropArrow?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslate();
  return (
    <div className="flex-center flex-shrink-0">
      <Modal
        open={open}
        maskClosable
        onCancel={() => {
          setOpen(false);
        }}
        width={500}
        title={t('dex.swap.token.modal.title')}
        footer={null}
      >
        <ModalContent
          value={value}
          disabledToken={disabledToken}
          onChange={onChange}
          onOpen={setOpen}
        />
      </Modal>
      <div
        className={cn(
          'flex-center h-[40px] flex-shrink-0  gap-[5px] rounded-[20px] text-tc-secondary',
          {
            'cursor-pointer hover:text-theme': !disabled,
          }
        )}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
      >
        {value?.symbol ? (
          <div className="flex-center gap-[5px]">
            <span className="flex-center text-[22px]">
              <TokenIcon src={value.icon} name={value?.symbol} />
            </span>
            <span className="text-[14px]">{value?.symbol}</span>
          </div>
        ) : (
          <span className="text-[14px]">{t('dex.swap.token.select')}</span>
        )}

        {showDropArrow && <DownOutlined className="text-[14px]" />}
      </div>
    </div>
  );
};

export default TokenSelector;
