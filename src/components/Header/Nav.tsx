import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/classnames.ts';
import { LogoIcon } from '@/components/icons';
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
  ];

  const { pathname } = useLocation();
  return (
    <div className="flex items-center gap-[40px] text-[16px] max-md:flex-1 max-md:justify-between max-md:gap-[5px] max-md:text-[14px]">
      <div className="flex-center gap-[10px]">
        <LogoIcon className="text-[40px] max-md:hidden" />
        <span className="text-[20px] font-bold max-md:hidden">Zerithium</span>
      </div>
      <div className="flex-center gap-[30px] max-md:gap-[20px]">
        {menus.map((child) => (
          <Link
            key={child.path}
            to={child.path}
            className={cn(
              ' px-[12px] text-[16px]  font-bold text-tc-secondary max-md:px-[8px] ',
              {
                'text-[16px] font-bold text-tc-primary ':
                  child.mather(pathname),
              }
            )}
          >
            {child.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Nav;
