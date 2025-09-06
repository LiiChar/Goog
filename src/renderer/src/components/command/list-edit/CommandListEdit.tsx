import { HTMLAttributes, useState } from 'react';
import style from './command-list-edit.module.scss';
import classNames from 'classnames';
import { CommandElement, MethodExecute } from '@renderer/types/command';
import { InputCommand } from '@renderer/ui/input-command/InputCommand';

type CommandListEditProps = {
  commands: CommandElement[];
  onChange: (commands: CommandElement[]) => void;
} & HTMLAttributes<HTMLDivElement>;

export const CommandListEdit = ({ commands, onChange, ...props }: CommandListEditProps) => {
  const setCommandList = (data: { command: string; method: MethodExecute }, i: number) => {
    commands[i] = { ...data, accomplition: 'async' };
    onChange([...commands]);
  };

  return (
    <section className={classNames(props.className, style.command_modal__main__element_list)}>
      {commands.map((cmd, i) => (
        <div key={i} className={style.command_modal__main__element_list__element}>
          <InputCommand
            value={cmd}
            setData={(command: string, method: MethodExecute) =>
              setCommandList({ command, method }, i)
            }
          />
        </div>
      ))}
    </section>
  );
};
