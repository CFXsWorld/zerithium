import { Drawer, DrawerProps } from 'antd';
import { PropsWithChildren } from 'react';
import useResize from '@/hooks/useResize.ts';

const DrawerContainer = ({
  children,
  ...rest
}: PropsWithChildren<DrawerProps>) => {
  const { isPC } = useResize();

  const PCDrawerProps: DrawerProps = {
    placement: 'right',
    closable: false,
    contentWrapperStyle: {
      margin: 20,
      borderRadius: 20,
    },
    rootClassName: 'outline-0 border-0',
    className: 'rounded-[20px]',
    maskStyle: {
      opacity: 0,
    },
  };
  const mobileDrawerProps: DrawerProps = {
    placement: 'bottom',
    closable: true,
    height: 'auto',
    contentWrapperStyle: {
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    drawerStyle: {
      height: '100%',
      flex: 1,
      minHeight: 300,
      maxHeight: 'calc(100vh-200px)',
      backgroundColor: 'var(--zerithium-fill-niubi)',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    rootClassName: 'outline-0 border-0',
  };
  return (
    <Drawer
      {...(isPC ? PCDrawerProps : mobileDrawerProps)}
      {...rest}
      destroyOnClose
    >
      <div className="h-full">{children}</div>
    </Drawer>
  );
};

export default DrawerContainer;
