import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import style from './command.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import { useCommandStore } from '@renderer/store/commandStore';
import { IoAdd, IoPlayCircle } from 'react-icons/io5';
import { Command as iCommand } from '@renderer/types/command';
import { CommandListEdit } from '@renderer/components/command/list-edit/CommandListEdit';
import { CommandLine } from '@renderer/components/command/line/CommandLine';
import { DEFAULT_COMMAND } from '@renderer/const/command';

export const Command = memo(() => {
  const { command_path, commands, setCommandPath, changeCommand, runCommand } = useCommandStore();
  const [params] = useSearchParams();
  let { command = '' } = useParams<{ command: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const cmd: iCommand | undefined = commands.find((cmd) => cmd.name.trim() == command.trim());

  if (cmd == undefined) {
    navigate('/');
    return <main className={style.command}>Произошла ошибка</main>;
  }

  const [title, setTitle] = useState(cmd.name);
  const [description, setDescription] = useState(cmd.description ?? '');
  const [cmds, setCmds] = useState(cmd.commands);

  useEffect(() => {
    if (params.get('name') != null && params.get('name') != '') {
      setCommandPath(params.get('name') ?? command_path);
    }
  }, [params.get('name')]);

  const handelEditable = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      changeCommand(cmd.name, {
        commands: cmds.filter((cmd) => cmd.command.length > 0),
        name: title,
        description: description,
      });
      navigate(`/command/${title}`);
    }
  };

  const onContentBlur = useCallback((evt) => {
    setDescription(evt.currentTarget.innerHTML);
  }, []);

  const handleAddCmd = () => {
    setCmds((prev) => [...prev, DEFAULT_COMMAND]);
  };

  return (
    <main className={style.command}>
      <button className={style.command__icon} onClick={() => runCommand(title)}>
        <IoPlayCircle />
      </button>
      <div className={style.command_title}>
        {isEditing ? (
          <input onChange={(e) => setTitle(e.target.value)} type="text" value={title} />
        ) : (
          title
        )}
      </div>
      <div className={style.command_edit}>
        <button onClick={handelEditable}>{isEditing ? 'Сохранить' : 'Редактировать'}</button>
      </div>
      <div className={style.command__info}>
        <div className={style.command_description}>
          <div
            onBlur={onContentBlur}
            style={isEditing ? { backgroundColor: 'var(--color-secondary)' } : {}}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
          >
            {description.length > 0 ? description : isEditing ? 'Введите занчение' : 'Описание'}
          </div>
        </div>
        {isEditing ? (
          <CommandListEdit
            style={{ paddingLeft: '0px' }}
            commands={cmds}
            onChange={(e) => setCmds(e)}
          />
        ) : (
          <CommandLine className={style.command_line} commands={cmds} variants="dot" />
        )}
        {isEditing && (
          <button onClick={handleAddCmd} className={style.command_commands__add}>
            <IoAdd />
          </button>
        )}
      </div>
    </main>
  );
});
