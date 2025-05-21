import { Token } from '@/types/swap.ts';
import { Skeleton } from 'antd';
import { cn } from '@/utils/classnames.ts';
import { TokenIcon } from '@/components/icons';
import { formatCurrency } from '@/utils';

const TokenList = ({
  tokens,
  loading,
}: {
  tokens: Token[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex w-full flex-col gap-[15px]">
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }
  return (
    <div className="my-[10px] flex flex-col gap-[15px] ">
      {(tokens || []).map((item) => (
        <div
          className={cn('flex-center gap-[10px] rounded-[12px]')}
          key={item.symbol}
        >
          <div className="h-full w-[35px]">
            <TokenIcon
              src={item.icon}
              width={35}
              height={35}
              name={item.symbol}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-[14px]"> {item.name}</span>
            <span className="text-[12px] text-tc-secondary">
              <span>{`${item.amount || 0} ${item.symbol}`}</span>
            </span>
          </div>
          <div className="flex items-center gap-[20px] text-[14px]">
            {formatCurrency(item.price || 0)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
