import { FC, memo, useState } from 'react'
import style from './inputList.module.scss'

interface IProps {
    setData: (data: string, isSelect?: boolean) => void
    list: string[],
    value: string
}

export const InputList: FC<IProps> = memo(({ list, setData, value }) => {
    const [visible, setVisible] = useState(false)

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length == 0 && visible) {
            setVisible(false)
        }
        setData(e.target.value, false)
    }

    const handleSelectItem = (item: string) => {
        console.log("1")
        setData(item, true)
        setVisible(false)
    }

    const handleBlur = () => {
        setTimeout(() => {
            setVisible(false)
        }, 200)
    }

    return (
        <div onBlur={handleBlur} className={style.input_list}>
            <input placeholder='Введите команду' className={style.input_list__input} type="text" value={value} onChange={handleChangeValue} onClick={() => setVisible(true)} />
            {
                visible && list.length != 0 &&
                <ul className={style.input_list__list}>
                    {list.map((item) => (
                        <li onClick={() => handleSelectItem(item)} key={item}>- {item}</li>
                    ))}
                </ul>
            }
        </div>
    )
})
