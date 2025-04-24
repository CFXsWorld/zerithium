import SwapPanel from './SwapPanel';
import { useState } from 'react';
import SendingPanel from './SendingPanel';
import LimitPanel from './LimitPanel';
import { Token } from '@/types/swap';

const SwapBox = ({
  receiveToken,
  onReceiveChange,
}: {
  receiveToken?: Token;
  onReceiveChange?: (token?: Token) => void;
}) => {
  const [swapType, setSwapType] = useState<'limit' | 'swap' | 'send' | string>(
    'swap'
  );
  const props = {
    onSwapTypeChange: setSwapType,
    receiveToken,
    onReceiveChange,
  };

  if (swapType === 'swap') {
    return <SwapPanel {...props} />;
  }
  if (swapType === 'send') {
    return <SendingPanel {...props} />;
  }
  return <LimitPanel {...props} />;
};

export default SwapBox;
