import { SwapRoute, Token } from '@/types/swap.ts';
import { TokenIcon } from '@/components/icons';
import { RightOutlined } from '@ant-design/icons';
import { Popover } from 'antd';

const RoutePath = ({ routes }: { routes: Token[] }) => {
  return (
    <div className="flex-center gap-[5px]">
      {routes.map((token, index) => (
        <div className="flex-center gap-[2px]" key={token.symbol}>
          <span className="flex-center gap-[5px]">
            <TokenIcon src={token?.icon} name={token.symbol} />
            {token?.symbol}
          </span>
          {index < routes.length - 1 && <RightOutlined />}
        </div>
      ))}
    </div>
  );
};

const RouteInfo = ({ router }: { router?: SwapRoute }) => {
  const routes = router?.route || [];
  if (routes.length > 3) {
    const fromToken = routes[0];
    const toToken = routes[routes.length - 1];
    return (
      <Popover title={<RoutePath routes={routes} />} placement="topRight">
        <div className="flex-center cursor-pointer gap-[5px]">
          <div className="flex-center gap-[2px]">
            <span className="flex-center gap-[5px]">
              <TokenIcon src={fromToken?.icon} name={fromToken.symbol} />
              {fromToken?.symbol}
            </span>
            <RightOutlined />
          </div>
          <span>...</span>
          <RightOutlined />
          <div className="flex-center gap-[2px]">
            <span className="flex-center gap-[5px]">
              <TokenIcon src={toToken?.icon} name={toToken.symbol} />
              {toToken?.symbol}
            </span>
          </div>
        </div>
      </Popover>
    );
  }
  return <RoutePath routes={routes} />;
};

export default RouteInfo;
