import style from './commandList.module.scss';
import { HTMLAttributes, memo } from 'react';
import { Command } from '@renderer/types/command';
import { CommandItem } from '@renderer/components/command/item/CommandItem';

type CommandListProps = {
  commands: Command[];
} & HTMLAttributes<HTMLDListElement>;

export const CommandList = memo(({ commands }: CommandListProps) => {
  return (
    <div className={style.command_list}>
      {commands.map((command) => (
        <CommandItem command={command} key={command.name} />
      ))}
    </div>
  );
});
