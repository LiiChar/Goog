import { HTMLAttributes, useState, useEffect } from 'react';
import style from './commandLine.module.scss';
import { CommandElement as CommandElementType } from '@renderer/types/command';
import { CommandElement } from '../element/CommandElement';
import { ipcRenderer } from 'electron';

type CommandLineProps = {
  commands: CommandElementType[];
  variants?: 'dot' | 'default';
} & HTMLAttributes<HTMLDivElement>;

export const CommandLine = ({
  commands,
  variants = 'default',
  className,
  ...attr
}: CommandLineProps) => {
  const [status, setStatus] = useState<any[]>([]);

  useEffect(() => {
    window.api.onCommandStatus((data) => {
      setStatus((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div {...attr} className={`${style.command_timeline} ${className ?? ''}`}>
      {commands.map((cmd) => (
        <CommandElement key={cmd.command} variants={variants} command={cmd} />
      ))}

      <div className={style.status}>
        {status.map((s, i) => (
          <div key={i}>
            <strong>{s.cmd}</strong>: {s.status}
            {s.output && <pre>{s.output}</pre>}
          </div>
        ))}
      </div>
    </div>
  );
};
