import { memo } from 'react';

import style from './footer.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { useCommandStore } from '@renderer/store/commandStore';
import { IoHomeSharp, IoSettingsSharp, IoPlayCircleSharp, IoAdd } from 'react-icons/io5';

export const Footer = memo(() => {
  const { command_path } = useCommandStore();
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    return pathname.split('?')[0] === path ? style.active : '';
  };

  return (
    <footer className={style.footer}>
      <nav>
        <Link to={`/add`} className={style.footer__link + ' ' + isActive(`/add`)}>
          <IoAdd strokeWidth={6} />
        </Link>
        <Link to={'/'} className={style.footer__link + ' ' + isActive(`/`)}>
          <IoHomeSharp />
        </Link>
        <Link to={'/setting'} className={style.footer__link + ' ' + isActive(`/setting`)}>
          <IoSettingsSharp />
        </Link>
      </nav>
    </footer>
  );
});
