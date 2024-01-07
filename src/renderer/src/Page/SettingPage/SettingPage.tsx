import { useThemeStore } from '@renderer/store/themeStore'
import style from './setting_page.module.scss'
import { SunSVG } from '@renderer/assets/svg/SunSVG'
import { MoonSVG } from '@renderer/assets/svg/MoonSVG'

export const SettingPage = () => {
    const { toggleTheme } = useThemeStore()
    return (
        <div className={style.main}>
            <button className={style.setting__toggle_theme} onClick={() => toggleTheme()}>
                <SunSVG className={style.setting__theme__svg} width={25} height={25} />
                <MoonSVG className={style.setting__theme__svg} width={25} height={25} />
            </button>
        </div>
    )
}
