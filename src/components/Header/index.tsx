import { LogoIcon, SettingIcon } from '@/components/icons';
import Nav from '@/components/Header/Nav.tsx';
import ConnectButton from '@/components/Wallet/ConnectButton';
import { Button, Popover } from 'antd';
import { useTheme } from '@/components/Theme';
import Lang from '@/components/Lang';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { cn } from '@/utils/classnames.ts';
import PendingTransactions from '@/components/PendingTransactions.tsx';
import useTxStore from '@/store/pending.ts';

const Header = () => {
  const { setTheme, theme } = useTheme();
  const pendingTransactions = useTxStore((state) => state.pendingTransactions);
  return (
    <div className="py-[20px flex h-[80px] items-center justify-between px-[30px] max-md:px-[20px]">
      <div
        className={cn(
          'flex  flex-1 items-center',
          'max-md:fixed max-md:bottom-[20px] max-md:left-[16px] max-md:right-[16px]',
          'max-md:z-[2] max-md:h-[48px] max-md:rounded-[10px] max-md:bg-fill-niubi4 max-md:px-[20px]'
        )}
      >
        <Nav />
      </div>
      <div className="flex-center justify-between gap-[20px] max-md:flex-1">
        <div className="md:hidden">
          <LogoIcon className="text-[40px]" />
        </div>
        <div className="flex flex-1 items-center justify-end gap-[10px] ">
          {pendingTransactions.length > 100 && <PendingTransactions />}
          <ConnectButton />
          <Popover
            content={
              <div className="flex w-[200px] flex-col gap-[20px]">
                <div className="flex-center-between">
                  <span>Theme</span>
                  <div className="flex-center gap-[20px]">
                    <Button
                      className="border-0"
                      onClick={() => {
                        setTheme('light');
                      }}
                      icon={<SunOutlined />}
                      type={theme === 'light' ? 'primary' : 'default'}
                    />
                    <Button
                      className="border-0"
                      onClick={() => {
                        setTheme('dark');
                      }}
                      type={theme === 'dark' ? 'primary' : 'default'}
                      icon={<MoonOutlined />}
                    />
                  </div>
                </div>
                <div className="flex-center-between">
                  <span>Language</span>
                  <Lang />
                </div>
              </div>
            }
            trigger={['click']}
            placement="bottomLeft"
            showArrow={false}
          >
            <Button
              icon={<SettingIcon className="cursor-pointer hover:text-theme" />}
              className="border-0"
            />
          </Popover>
        </div>
      </div>
    </div>
  );
};
export default Header;
