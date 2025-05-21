import useProvider from '@/hooks/useProvider';

import { JsonRpcProvider } from 'ethers';
import { useEffect, useState } from 'react';
const ChainBlockHeight = () => {
  const { rpc } = useProvider();
  const provider = new JsonRpcProvider(rpc);
  const [blockHeight, setBlockHeight] = useState(0);

  useEffect(() => {
    provider.getBlockNumber().then((res) => {
      setBlockHeight(res);
    });
  }, []);

  return (
    <div className="fixed bottom-[20px] right-[40px]">
      <div className="flex items-center gap-[10px]">
        <div className="glow"></div>
        <span className="pl-[10px]">{blockHeight || ''}</span>
      </div>
    </div>
  );
};

export default ChainBlockHeight;
