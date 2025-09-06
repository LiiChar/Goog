import { useCommandStore } from '@renderer/store/commandStore';
import { HTMLAttributes, ReactNode, useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import style from './search-modal.module.scss';
import useKeyPress from '@renderer/hooks/useKeyPress';

type SearchModalProps = {
  children?: ReactNode;
} & HTMLAttributes<HTMLButtonElement>;

export const SearchModal = ({ children, ...props }: SearchModalProps) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { commands, runCommand } = useCommandStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const searchCommands =
    commands.filter((cmd) => cmd.name.toLowerCase().includes(search.toLowerCase())).length > 0
      ? commands.filter((cmd) => cmd.name.toLowerCase().includes(search.toLowerCase()))
      : search.length > 0
        ? []
        : commands;

  useKeyPress('Enter', () => {
    if (modalIsOpen && searchCommands.length > 0 && search.length > 0) {
      runCommand(searchCommands[0].name);
      closeModal();
    }
  });

  useKeyPress('Control+f', () => {
    openModal();
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleNavigateButton = (name: string) => {
    setSearch('');
    navigate(`/command/${name}`);
    closeModal();
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button {...props} className={props.className} onClick={openModal}>
        {children}
      </button>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={style.modal}
        overlayClassName={style.overlay}
        contentLabel="Search modal"
      >
        <div className={style.search__input}>
          <div>
            <input
              autoFocus
              value={search}
              onChange={handleSearch}
              placeholder="Введите название комманды"
              type="text"
            />
            <div className={style.search__input__button}>
              <IoSearchSharp />
            </div>
          </div>

          {search.length > 0 && (
            <ul className={style.search_input__list}>
              {searchCommands.length > 0 && search.length > 0 ? (
                searchCommands.map((cmd) => (
                  <li onClick={() => handleNavigateButton(cmd.name)} key={cmd.name}>
                    {cmd.name}
                  </li>
                ))
              ) : (
                <li className={style.not_found}>Не найдено</li>
              )}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
};
