import { CommandSVG } from '@renderer/assets/svg/CommandSVG'
import { MainSVG } from '@renderer/assets/svg/MainSVG'
import { SettingSVG } from '@renderer/assets/svg/SettingSVG'
import { memo } from 'react'

import style from './footer.module.scss'
import { Link, useLocation } from 'react-router-dom'
import { useCommandStore } from '@renderer/store/commandStore'

export const Footer = memo(() => {
    const { command_path } = useCommandStore()
    const { pathname } = useLocation()

    const buildIInlineStyle = (path: string | boolean): React.CSSProperties | undefined => {
        if (typeof path == 'string') {

            if (path == pathname) {
                return { transform: `translateY(-15px)` }

            } else {
                return {}
            }
        } else {
            if (path) {
                return {
                    borderBottom: "1px solid var(--font-color)"
                }
            } else {
                return {}
            }

        }
    }

    return (
        <footer className={style.footer}>
            <nav>
                <Link to={`/command?name=${command_path}`} style={buildIInlineStyle(pathname == "/command")} className={style.footer__link}>
                    <CommandSVG to={`/command?name=${command_path}`} style={buildIInlineStyle('/command')} strokeWidth={2} fill='none' height={25} width={25} />
                </Link>
                <Link style={buildIInlineStyle(pathname == "/")} to={'/'} className={style.footer__link}>
                    <MainSVG to={'/'} style={buildIInlineStyle('/')} strokeWidth={2} fill='none' height={25} width={25} />
                </Link>
                <Link style={buildIInlineStyle(pathname == "/setting")} to={'/setting'} className={style.footer__link}>
                    <SettingSVG to={'/setting'} style={buildIInlineStyle('/setting')} strokeWidth={4} height={25} width={25} />
                </Link>
            </nav>
        </footer>
    )
})
