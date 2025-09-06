import { CommandElement } from '@renderer/types/command';
import style from './command-add.module.scss';
import { useCommandStore } from '@renderer/store/commandStore';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { CommandListEdit } from '@renderer/components/command/list-edit/CommandListEdit';
import { DEFAULT_COMMAND } from '@renderer/const/command';

export const CommandAdd = () => {
  const [title, setTitle] = useState('');
  const { addCommand } = useCommandStore();
  const [commands, setCommands] = useState<CommandElement[]>([DEFAULT_COMMAND]);

  const addElement = () => {
    setCommands((prev) => [...prev, DEFAULT_COMMAND]);
  };

  const createCommand = () => {
    if (!(title.length > 0)) {
      return;
    }
    addCommand({
      commands: commands.filter(Boolean),
      name: title,
    });
    setTitle('');
    setCommands([DEFAULT_COMMAND]);
    CommandListEdit;
  };

  return (
    <main className={style.command_modal}>
      <div onClick={(e) => e.stopPropagation()} className={style.command_modal__main}>
        <input
          placeholder="Введите название комманды"
          className={style.command_modal__input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <CommandListEdit commands={commands} onChange={(d) => setCommands(d)} />
        <div className={style.command_modal__main__actions}>
          <button onClick={addElement}>
            <IoAdd />
          </button>
          <button onClick={createCommand}>Создать</button>
        </div>
      </div>
    </main>
  );
};
