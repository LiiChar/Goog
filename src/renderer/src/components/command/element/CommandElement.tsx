import { CommandElement as CommandElementType } from '@renderer/types/command';
import { HTMLAttributes } from 'react';
import style from './command-element.module.scss';
import classNames from 'classnames';
import { MethodIcons } from '@renderer/ui/input-command/InputCommand';

type CommandElementProps = {
  command: CommandElementType;
  variants?: 'dot' | 'default';
} & HTMLAttributes<HTMLDivElement>;

export const CommandElement = ({
  command,
  variants = 'default',
  ...props
}: CommandElementProps) => {
  return (
    <div {...props} className={classNames(props.className, style.command_element, style[variants])}>
      <span className={style.command_element__method}>{MethodIcons[command.method]}</span>
      <span className={style.command_element__command}>{command.command}</span>
    </div>
  );
};
