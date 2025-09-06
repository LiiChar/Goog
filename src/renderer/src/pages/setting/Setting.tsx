import { useThemeStore } from '@renderer/store/themeStore';
import style from './setting.module.scss';
import { IoSunny, IoMoonSharp } from 'react-icons/io5';

export const Setting = () => {
  const { toggleTheme, theme } = useThemeStore();

  return (
    <main>
      <div className={style.setting__item}>
        <p>Theme: </p>
        <button onClick={() => toggleTheme()}>
          {theme == 'light-mode' ? <IoSunny /> : <IoMoonSharp />}
        </button>
      </div>
    </main>
  );
};
