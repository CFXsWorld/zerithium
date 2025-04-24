import TokenInput from '@/components/TokenInput.tsx';
import WithAuthButton from '@/components/Wallet/WithAuthButton.tsx';
import { Button, Form } from 'antd';
import SecondTabs from '@/pages/dex/swap/SecondTabs.tsx';
import AddressInput from '@/components/AddressInput.tsx';
import { isAddress } from 'viem';
import useSendToken from '@/pages/dex/hooks/useSendToken.ts';
import { useTranslate } from '@/i18n';

const SendingPanel = ({
  onSwapTypeChange,
}: {
  onSwapTypeChange: (value: string) => void;
}) => {
  const {
    inputToken,
    setInputToken,
    payAmount,
    setPayAmount,
    inputOwnerAmount,
    inputTokenTotalPrice,
    isInsufficient,
    cisAddress,
    form,
    getAddrByCISId,
    cis,
    confirm,
    isSubmittedLoading,
  } = useSendToken();
  const { t } = useTranslate();

  const renderSwapText = () => {
    if (isInsufficient) {
      return t('common.error.insufficient', { name: `${inputToken?.symbol}` });
    }

    return t('dex.send.title');
  };
  return (
    <div className="min-h-[420px] w-[500px]  rounded-[20px] bg-fill-niubi p-[20px] max-md:w-full">
      <div className="flex items-center justify-between ">
        <SecondTabs active="send" onChange={onSwapTypeChange} />
      </div>
      <div className="mt-[20px]">
        <TokenInput
          title={t('dex.send.input.pay')}
          editable
          token={inputToken}
          onTokenChange={setInputToken}
          amount={payAmount}
          onAmountChange={setPayAmount}
          onMax={(ownerAmount) => {
            setPayAmount(ownerAmount.toString());
          }}
          ownerAmount={inputOwnerAmount}
          totalPrice={inputTokenTotalPrice}
        />
        <div className="h-[20px]" />
        <Form form={form}>
          <Form.Item
            rules={[
              {
                validator: async (_, value) => {
                  if (value) {
                    if (!isAddress(value)) {
                      const addr = await getAddrByCISId(value);
                      if (!addr) {
                        return Promise.reject(
                          t('common.error.no.record.address.')
                        );
                      }
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
            name="address"
          >
            <AddressInput
              title={t('dex.send.to')}
              placeholder={t('dex.send.to.placeholder')}
              cisAddress={cisAddress}
            />
          </Form.Item>
        </Form>
        {cisAddress && (
          <p className="mt-[-20px] text-[14px] text-tc-secondary">
            {cisAddress}
          </p>
        )}
      </div>

      <div className="mt-[30px] h-[56px]  w-full">
        <WithAuthButton>
          <Button
            className="w-full"
            type="primary"
            size="large"
            loading={isSubmittedLoading}
            disabled={!(isAddress(cis) || !!cisAddress) || isInsufficient}
            onClick={() => {
              form.validateFields().then(() => {
                confirm();
              });
            }}
          >
            {renderSwapText()}
          </Button>
        </WithAuthButton>
      </div>
    </div>
  );
};

export default SendingPanel;
