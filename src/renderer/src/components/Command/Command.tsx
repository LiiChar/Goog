import { useCommandStore } from '@renderer/store/commandStore'
import style from './command.module.scss'
import { StartSVG } from '@renderer/assets/svg/StartSVG';
import CloseSVG from '@renderer/assets/svg/CloseSVG';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Command = memo(() => {
    const { commands, runCommand, removeCommand } = useCommandStore();
    const [visibleCommand, setVisibleCommand] = useState<string>('')
    const navigate = useNavigate()

    const toggleVisibleCommand = (name: string) => {
        if (visibleCommand == name) {
            setVisibleCommand('')
        } else {
            setVisibleCommand(name)
        }
    }

    const handleRunCommand = async (name: string) => {
        await runCommand(name)
    }

    return (
        <main className={style.command_list}>
            {commands.map((command) => (
                <article key={command.name} className={style.command_list__item}>
                    <div className={style.command_list__item__info}>
                        <div onClick={() => navigate(`/command?name=${command.name}`)} className={style.command_list__item__info__title}>
                            {command.name}
                        </div>
                        <div onClick={() => toggleVisibleCommand(command.name)} className={style.command_list__item__info__command}>
                            Show command: {<StartSVG fill='rgb(236, 153, 210)' height={8} width={8} style={{ transform: "rotate(90deg)" }} />}
                            {visibleCommand.includes(command.name) && command.commands.length != 0 &&
                                <ul className={style.command_list__item__info__command__list}>
                                    {command.commands.map((cmd, i) => (
                                        <li key={cmd + i}>
                                            {`${i + 1}: ${cmd}`}
                                        </li>
                                    ))}
                                </ul>}
                        </div>
                    </div>
                    <div className={style.command_list__item__action}>
                        <button className={style.command_list__item__action__start} onClick={() => handleRunCommand(command.name)}>
                            <StartSVG strokeWidth={3} height={15} width={15} />
                        </button>
                        <button className={style.command_list__item__action__remove} onClick={() => removeCommand(command.name)}>
                            <CloseSVG height={15} width={15} />
                        </button>
                    </div>
                </article>
            ))}
        </main>
    )
})
