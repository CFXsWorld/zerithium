import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/classnames.ts';
import { LogoIcon, GitIcon } from '@/components/icons';
import { useTranslate } from '@/i18n';

const Nav = () => {
  const { t } = useTranslate();

  const menus = [
    {
      name: t('common.nav.lending.dashboard'),
      path: '/lending/dashboard',
      mather: (pathname: string) => pathname.includes('/lending/dashboard'),
    },
    {
      name: t('common.nav.lending.market'),
      path: '/lending/market',
      mather: (pathname: string) => pathname.includes('/lending/market'),
    },
    {
      name: 'Rewards',
      path: '/rewards',
      mather: (pathname: string) => pathname.includes('/rewards'),
      icon: <GitIcon />,
      disabled: true,
    },
  ];

  const { pathname } = useLocation();
  return (
    <div className="flex items-center gap-[40px] text-[16px] max-md:flex-1 max-md:justify-between max-md:gap-[5px] max-md:text-[12px]">
      <div className="flex-center gap-[10px]">
        <LogoIcon className="text-[40px] max-md:hidden" />
        <span className="text-[20px] font-bold max-md:hidden">Zerithium</span>
      </div>
      <div className="flex-center gap-[30px] max-md:gap-[10px]">
        {menus.map((child) => (
          <Link
            key={child.path}
            to={child.disabled ? '#' : child.path}
            className={cn(
              ' px-[12px] text-[16px]  font-bold text-tc-secondary max-md:px-[8px] max-md:text-[14px] ',
              {
                'text-[16px] font-bold text-tc-primary ':
                  child.mather(pathname) && !child.disabled,
                'cursor-not-allowed opacity-50': child.disabled,
              }
            )}
          >
            {child.name}
            {child.icon && (
              <span className="mr-[5px] text-[20px] max-md:text-[16px]">
                {child.icon}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Nav;
