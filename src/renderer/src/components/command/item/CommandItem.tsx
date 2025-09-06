import { useCommandStore } from '@renderer/store/commandStore';
import { HTMLAttributes, useState } from 'react';
import style from './commandItem.module.scss';

import { IoPlay, IoClose, IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { CommandLine } from '@renderer/components/command/line/CommandLine';
import { Command } from '@renderer/types/command';

type CommandItemProps = {
  command: Command;
} & HTMLAttributes<HTMLDListElement>;

export const CommandItem = ({ command }: CommandItemProps) => {
  const { runCommand, removeCommand } = useCommandStore();
  const [visibleCommand, setVisibleCommand] = useState<string>('');
  const navigate = useNavigate();

  const toggleVisibleCommand = (name: string) => {
    setVisibleCommand(visibleCommand === name ? '' : name);
  };

  const handleRunCommand = async (name: string) => {
    await runCommand(name);
  };

  return (
    <article className={style.command_list__item}>
      <div className={style.command_list__item__info}>
        <div
          onClick={() => navigate(`/command/${command.name}`)}
          className={style.command_list__item__info__title}
        >
          {command.name}
        </div>

        <button
          onClick={() => toggleVisibleCommand(command.name)}
          className={style.command_list__item__info__command_toggle}
        >
          <IoChevronForward className={visibleCommand === command.name ? style.open : ''} />
          <span>Команды</span>
        </button>

        {visibleCommand === command.name && command.commands.length > 0 && (
          <CommandLine className={style.command_line} commands={command.commands} variants="dot" />
        )}
      </div>

      <div className={style.command_list__item__action}>
        <button
          className={style.command_list__item__action__start}
          onClick={() => handleRunCommand(command.name)}
        >
          <IoPlay />
        </button>
        <button
          className={style.command_list__item__action__remove}
          onClick={() => removeCommand(command.name)}
        >
          <IoClose />
        </button>
      </div>
    </article>
  );
};
