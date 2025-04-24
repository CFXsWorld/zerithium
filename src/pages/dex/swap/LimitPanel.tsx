import Slippage from '@/pages/dex/swap/Slippage.tsx';

import useWalletAuth from '@/components/Wallet/useWalletAuth.ts';
import SecondTabs from '@/pages/dex/swap/SecondTabs.tsx';

const LimitPanel = ({
  onSwapTypeChange,
}: {
  onSwapTypeChange: (value: string) => void;
}) => {
  const { disabled } = useWalletAuth();

  return (
    <div className="min-h-[420px] w-[500px]  rounded-[20px] bg-fill-niubi p-[20px] max-md:w-full">
      <div className="flex items-center justify-between ">
        <SecondTabs active="limit" onChange={onSwapTypeChange} />
        <Slippage
          value={'0'}
          onChange={() => {}}
          disabled={disabled}
          deadline={'1'}
          onDeadlineChange={() => {}}
        />
      </div>
      <div className="mt-[20px]">....</div>
    </div>
  );
};

export default LimitPanel;
