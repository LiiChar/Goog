import { memo, useState } from 'react'
import style from "./header.module.scss"
import CloseSVG from '../../assets/svg/CloseSVG'
import PlusSVG from '../../assets/svg/PlusSVG'
import SearchSVG from '../../assets/svg/SearchSVG'
import { useThemeStore } from '@renderer/store/themeStore'
import { useCommandStore } from '@renderer/store/commandStore'
import { useNavigate } from 'react-router-dom'

export const Header = memo(() => {
    const [search, setSearch] = useState("")
    const { commands } = useCommandStore()
    const { toggleVisible } = useThemeStore()
    const navigate = useNavigate()

    const searchCommands = commands.filter((cmd) => cmd.name.toLowerCase().includes(search.toLowerCase()))

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const hadleCreate = () => {
        toggleVisible()
    }

    const handleQuit = () => {
        window.api.quit()
        window.api.onCommandRes(JSON.stringify(commands))
    }

    const handleNavigateButton = (name: string) => {
        setSearch("")
        navigate(`/command?name=${name}`)
    }

    return (
        <header className={style.header}>
            <button onClick={hadleCreate} className={style.header__add}>
                <PlusSVG width={15} height={15} />
            </button>
            <div className={style.header__input}>
                <input value={search} onChange={handleSearch} placeholder='Введите название комманды' type="text" />
                <button className={style.header__input__button}>
                    <SearchSVG style={{ marginRight: "5px" }} width={15} height={15} />
                </button>
                {search.length > 0 &&
                    <ul className={style.header_input__list}>
                        {
                            searchCommands.length > 0 ?
                                searchCommands.map((cmd) => (
                                    <li onClick={() => handleNavigateButton(cmd.name)} key={cmd.name}>
                                        {cmd.name}
                                    </li>
                                )) :
                                <li>
                                    Не найдено
                                </li>
                        }

                    </ul>}
            </div>
            <button className={style.header__action}>
                <CloseSVG width={15} height={15} onClick={handleQuit} />
            </button>
        </header>
    )
})
