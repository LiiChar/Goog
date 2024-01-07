import { useThemeStore } from '@renderer/store/themeStore'
import style from "./commandModal.module.scss"
import { useCommandStore } from '@renderer/store/commandStore'
import PlusSVG from '../../../assets/svg/PlusSVG'
import { useMemo, useState } from 'react'
import { InputList } from '@renderer/ui/InputList/InputList'

export const CommandModal = () => {
    const [data, setData] = useState<string[]>([])
    const [title, setTitle] = useState('');
    const { isVisible, toggleVisible } = useThemeStore()
    const { commands, addCommand } = useCommandStore()
    const [elements, setElements] = useState<any[]>([InputList])

    const commandList = useMemo(() => {
        return commands.map((command) => command.name)
    }, [commands])

    const setCommandList = (name: string, i: number, is: boolean) => {
        setData(prev => {
            prev[i] = is ? `^${name}~` : name
            return [...prev]
        })

    }

    const handleVisible = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
        e.stopPropagation()
        toggleVisible()
    }

    const addElement = () => {
        setElements(prev => [...prev, InputList])
    }

    const reviewButton = (i: number) => {
        window.api.openModal((value) => {
            setData(prev => {
                prev[i] = value[0]
                return [...prev]
            })
        })
    }

    const createCommand = () => {
        if (!(title.length > 0)) {
            return
        }
        const parsedCommand = parseComment(data)
        addCommand({
            commands: parsedCommand,
            name: title,
        })
        toggleVisible()
        setData([])
        setTitle('')
        setElements([InputList])
    }

    const parseComment = (comands: string[]) => {
        while (comands.findIndex((cmd) => cmd && cmd.includes('^') && cmd.includes('~')) != -1) {
            let elemet = comands.findIndex((cmd) => cmd.includes('^') && cmd.includes('^'))!
            let cmds = commands.find((cmd) => `^${cmd.name}~` == comands[elemet])!.commands
            comands.splice(elemet, 1, ...cmds)
        }
        return comands.filter(function (element) {
            return element !== undefined && element !== null && element != '';
        });
    }

    return (
        <dialog className={style.command_modal} open={isVisible} onClick={handleVisible}>
            <div onClick={(e) => e.stopPropagation()} className={style.command_modal__main}>
                <input placeholder='Введите название комманды' className={style.command_modal__input} type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <section className={style.command_modal__main__element_list}>
                    {
                        elements.map((El, i) => (
                            <div key={i} className={style.command_modal__main__element_list__element}>
                                <El value={data[i]}
                                    list={commandList}
                                    setData={(value: string, is: boolean) => setCommandList(value, i, is)}
                                />
                                <button onClick={() => reviewButton(i)}>Обзор</button>
                            </div>
                        ))
                    }
                </section>
                <div className={style.command_modal__main__actions}>
                    <button onClick={addElement}>
                        <PlusSVG width={15} height={15} />
                    </button>
                    <button onClick={createCommand}>
                        Создать
                    </button>
                </div>
            </div>
        </dialog>
    )
}
