/// <reference types="vite-plugin-svgr/client" />
import { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react';
import AntdIcon from '@ant-design/icons';
import ETH from '@/assets/svgs/tokens/ETH-Ethereum.svg?react';
import BTC from '@/assets/svgs/tokens/BTC.svg?react';
import USDT from '@/assets/svgs/tokens/USDT.svg?react';

type IconProps = PropsWithChildren<
  {
    className?: string;
    style?: CSSProperties;
  } & HTMLAttributes<HTMLElement>
>;

export const Icon = ({ className, style, children, ...props }: IconProps) => {
  return (
    <AntdIcon className={className} style={style} {...props}>
      {children}
    </AntdIcon>
  );
};

export const ETHIcon = (props: IconProps) => (
  <Icon {...props}>
    <ETH />
  </Icon>
);

export const BTCIcon = (props: IconProps) => (
  <Icon {...props}>
    <BTC />
  </Icon>
);

export const USDTIcon = (props: IconProps) => (
  <Icon {...props}>
    <USDT />
  </Icon>
);
