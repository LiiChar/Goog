import { useNavigate, useSearchParams } from 'react-router-dom'
import style from './command_page.module.scss'
import { memo, useCallback, useEffect, useState } from 'react'
import { ICommand, useCommandStore } from '@renderer/store/commandStore'
import SearchSVG from '@renderer/assets/svg/SearchSVG'
import CloseSVG from '@renderer/assets/svg/CloseSVG'
import PlusSVG from '@renderer/assets/svg/PlusSVG'
import { StartSVG } from '@renderer/assets/svg/StartSVG'

export const CommandPage = memo(() => {
    const { command_path, commands, setCommandPath, changeCommand, runCommand } = useCommandStore()
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)


    const cmd: ICommand | undefined = commands.find((cmd) => cmd.name == params.get('name') ?? command_path)

    if (cmd == undefined) {
        navigate('/')
        return <main className={style.command}>
            Произошла ошибка
        </main>
    }

    const [title, setTitle] = useState(cmd.name)
    const [description, setDescription] = useState(cmd.description ?? "")
    const [cmds, setCmds] = useState(cmd.commands)


    useEffect(() => {
        if (params.get('name') != null && params.get('name') != '') {
            setCommandPath(params.get('name') ?? command_path)
        }
    }, [params.get('name')])

    const handleChangeCommand = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        setCmds((prev) => {
            prev[i] = e.target.value
            return [...prev]
        })
    }

    const handelEditable = () => {
        setIsEditing(prev => !prev)
        if (isEditing) {
            changeCommand(cmd.name, {
                commands: cmds,
                name: title,
                description: description
            })
            navigate(`/command?name=${title}`)
        }
    }

    const removeCommand = (i: number) => {
        setCmds(prev => {
            prev.splice(i, 1)
            return [...prev]
        })
    }

    const onContentBlur = useCallback(evt => {
        setDescription(evt.currentTarget.innerHTML)
    }, [])

    const onReview = (i: number) => {
        window.api.openModal((value) => {
            setCmds(prev => {
                prev[i] = value[0]
                return [...prev]
            })
        })
    }

    const handleAddCmd = () => {
        setCmds(prev => [...prev, ''])
    }

    return (
        <main className={style.command}>

            <div className={style.command__icon}>
                <button onClick={() => runCommand(title)} >
                    <StartSVG width={50} height={50} />
                </button>
            </div>
            <div className={style.command_title}>
                <input onChange={(e) => setTitle(e.target.value)} disabled={!isEditing} type="text" value={title} />
            </div>
            <div className={style.command_edit}>
                <button onClick={handelEditable}>{isEditing ? "Сохранить" : "Редактировать"}</button>
            </div>
            <div className={style.command__info}>

                <div className={style.command_description}>
                    <div
                        onBlur={onContentBlur}
                        style={isEditing ? { backgroundColor: "var(--color-secondary)" } : {}} contentEditable={isEditing}
                        suppressContentEditableWarning={true}>

                        {description.length > 0 ? description : isEditing ? "Введите занчение" : 'Описание'}
                    </div>
                </div>
                <div className={style.command_commands}>
                    {
                        cmds.map((command, i) => (
                            <div className={style.command_commands__command}>
                                <div className={style.command_commands__command__info}>
                                    <span><span>{`${i + 1}:`}</span> <input onChange={(e) => handleChangeCommand(e, i)} disabled={!isEditing} type="text" value={command} /></span>
                                </div>
                                {isEditing && <div className={style.command_commands__command__action}>
                                    <button onClick={() => onReview(i)}>
                                        <SearchSVG width={10} height={10} />
                                    </button>
                                    <button onClick={() => removeCommand(i)}>
                                        <CloseSVG width={10} height={10} />
                                    </button>
                                </div>}
                            </div>
                        ))
                    }
                </div>
            </div>
            {isEditing && <button onClick={handleAddCmd} className={style.command_commands__add}>
                <PlusSVG height={15} width={15} />
            </button>}

        </main >
    )
})
