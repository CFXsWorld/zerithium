import beosin from '@/assets/images/Beosin.svg';
import github from '@/assets/images/Github.svg';
import salus from '@/assets/images/salus.svg';
import telegram from '@/assets/images/Telegram.svg';
import twitter from '@/assets/images/Twitter.svg';
import Docsd from '@/assets/images/Subtract-dark.svg';

import beosind from '@/assets/images/Beosin-dark.svg';
import githubd from '@/assets/images/Github-dark.svg';
import salusd from '@/assets/images/salus-dark.svg';
import telegramd from '@/assets/images/Telegram-dark.svg';
import twitterd from '@/assets/images/Twitter-dark.svg';
import Docs from '@/assets/images/Subtract.svg';
import { Link } from 'react-router-dom';
import { getTheme } from '../Theme';

const Audited = () => {
  const theme = getTheme('theme');
  return (
    <>
      <div className="pl-[30px]">
        <span className="py-[10px] text-tc-secondary">Audited by</span>
        <div className="my-[10px] flex  items-center justify-start gap-[20px]">
          <Link
            to="https://github.com/artixv/Xunion-Beosin-Audit"
            target="_blank"
          >
            <img src={theme === 'dark' ? beosind : beosin} alt="" width={70} />
          </Link>
          <Link
            to="https://github.com/artixv/Xunion-Salus-Audit"
            target="_blank"
          >
            <img src={theme === 'dark' ? salusd : salus} alt="" width={70} />
          </Link>
        </div>
        <div className="mt-[20px] flex gap-[10px] pb-[20px]">
          <Link to="https://x.com/xunionofficial" target="_blank">
            <img src={theme === 'dark' ? twitterd : twitter} alt="" />
          </Link>
          <Link to="https://t.me/ConfluxWeb3China" target="_blank">
            <img src={theme === 'dark' ? telegramd : telegram} alt="" />
          </Link>
          <Link to="https://github.com/artixv" target="_blank">
            <img src={theme === 'dark' ? githubd : github} alt="" />
          </Link>
          <Link to="https://doc.zerithium.io" target="_blank">
            <img
              src={theme === 'dark' ? Docsd : Docs}
              alt=""
              className="mt-[3px]"
            />
          </Link>
        </div>
        <span className="flex items-center gap-[5px] pb-[20px] text-[14px]">
          <span>EMAIL： hallo@zerithium.io</span>
        </span>
      </div>
    </>
  );
};

export default Audited;
