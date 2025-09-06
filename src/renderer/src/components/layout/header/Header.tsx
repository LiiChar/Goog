import { memo, useMemo } from 'react';
import style from './header.module.scss';
import { IoCloseOutline, IoSearchSharp } from 'react-icons/io5';
import { useCommandStore } from '@renderer/store/commandStore';
import { SearchModal } from '@renderer/components/modals/search/SearchModal';
import { useLocation } from 'react-router-dom';

const Title = {
  add: 'Создание комманды',
  setting: 'Настройки',
  '': 'Главная',
  command: 'Комманда',
};

export const Header = memo(() => {
  const { commands } = useCommandStore();
  const { pathname } = useLocation();
  const handleQuit = () => {
    window.api.quit();
    window.api.onCommandRes(JSON.stringify(commands));
  };

  const title = useMemo(() => {
    const url = decodeURIComponent(pathname);
    let name = url.split('/')[1];
    if (Title[name] === Title['command']) {
      const commandname = url.split('/')[2];
      name = `${Title[name]} ${commandname}`;
    } else {
      name = Title[name];
    }

    return name;
  }, [pathname]);

  return (
    <header className={style.header_container}>
      <div className={style.header}>
        <SearchModal className={style.header__action}>
          <IoSearchSharp />
        </SearchModal>
        <h1>{title}</h1>
        <button className={style.header__action}>
          <IoCloseOutline onClick={handleQuit} />
        </button>
      </div>
    </header>
  );
});
