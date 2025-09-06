import { CommandList } from '@renderer/components/command/list/CommandList';
import style from './main.module.scss';
import { useCommandStore } from '@renderer/store/commandStore';

export function Main(): JSX.Element {
  const { commands } = useCommandStore();

  return (
    <main className={style.main}>
      <CommandList className={style.command_line} commands={commands} />
    </main>
  );
}
