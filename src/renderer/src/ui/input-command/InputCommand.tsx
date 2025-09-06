import { HTMLAttributes, memo, useState } from 'react';
import { BsBrowserChrome, BsMouseFill } from 'react-icons/bs';
import { IoTerminal } from 'react-icons/io5';
import { FaClock, FaKeyboard, FaSteam } from 'react-icons/fa';
import { Select } from 'radix-ui';
import { SelectItem } from '@radix-ui/react-select';
import style from './input-command.module.scss';
import { CommandElement, MethodExecute } from '@renderer/types/command';

type InputListProps = {
  setData: (command: string, method: MethodExecute) => void;
  value: CommandElement | { command: string };
} & HTMLAttributes<HTMLInputElement>;

export const MethodIcons = {
  browser: <BsBrowserChrome />,
  cmd: <IoTerminal />,
  steam: <FaSteam />,
  mouse: <BsMouseFill />,
  keyboard: <FaKeyboard />,
  wait: <FaClock />,
};

const ExecuteMethods: Record<
  MethodExecute,
  { name: MethodExecute; icon: JSX.Element; placeholder: string; hideReview: boolean }
> = {
  browser: {
    name: 'browser',
    icon: <BsBrowserChrome />,
    placeholder: 'Введите ссылку',
    hideReview: true,
  },
  cmd: {
    name: 'cmd',
    icon: <IoTerminal />,
    placeholder: 'Введите команду',
    hideReview: false,
  },
  steam: {
    name: 'steam',
    icon: <FaSteam />,
    placeholder: 'Введите имя игры',
    hideReview: false,
  },
  mouse: {
    name: 'mouse',
    icon: <BsMouseFill />,
    placeholder: 'Введите координаты',
    hideReview: false,
  },
  keyboard: {
    name: 'keyboard',
    icon: <FaKeyboard />,
    placeholder: 'Введите кнопки',
    hideReview: true,
  },
  wait: {
    name: 'wait',
    icon: <FaClock />,
    placeholder: 'Введите время ожидание',
    hideReview: true,
  },
};

export const InputCommand = memo(({ setData, value, ...props }: InputListProps) => {
  const [visible, setVisible] = useState(false);
  const [method, setMethod] = useState<keyof typeof ExecuteMethods>(
    'method' in value ? value.method : 'browser',
  );
  const [guesses, setGuesses] = useState<string[]>([]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length == 0 && visible) {
      setVisible(false);
    }
    setData(e.target.value, method);
  };

  const handleSelectItem = (item: string) => {
    setData(item, method);
    setVisible(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  const reviewButton = () => {
    window.api.openModal((value) => {
      setData(value[0], method);
    });
  };

  return (
    <div onBlur={handleBlur} className={style.input_list}>
      <div>
        <Select.Root
          value={method}
          onValueChange={(m: keyof typeof ExecuteMethods) => setMethod(m)}
          defaultValue={ExecuteMethods['browser'].name}
        >
          <Select.Trigger
            className={style.Trigger}
            defaultValue={ExecuteMethods['browser'].name}
            aria-label="Method execute comannds"
          >
            {ExecuteMethods[method as keyof typeof ExecuteMethods].icon}
          </Select.Trigger>
          <Select.Content className={style.Content}>
            <Select.Viewport className={style.Viewport}>
              {Object.keys(ExecuteMethods).map((item) => (
                <SelectItem
                  key={item}
                  className={style.Item}
                  value={ExecuteMethods[item as keyof typeof ExecuteMethods].name}
                >
                  {ExecuteMethods[item as keyof typeof ExecuteMethods].icon}
                </SelectItem>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Root>

        <input
          {...props}
          placeholder={ExecuteMethods[method as keyof typeof ExecuteMethods].placeholder}
          className={style.input_list__input + ' ' + props.className}
          type="text"
          value={value.command}
          onChange={handleChangeValue}
          onClick={() => setVisible(true)}
        />
        {!ExecuteMethods[method as keyof typeof ExecuteMethods].hideReview && (
          <button onClick={() => reviewButton()}>Обзор</button>
        )}
      </div>
      {visible && guesses.length != 0 && (
        <ul className={style.input_list__list}>
          {guesses.map((item) => (
            <li onClick={() => handleSelectItem(item)} key={item}>
              - {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
