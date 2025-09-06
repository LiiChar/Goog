import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import _ from 'lodash';
import { Command } from '@renderer/types/command';

interface CommandStore {
  command_path: string;
  commands: Command[];
  history: Command[];
  setCommandPath: (path: string) => void;
  changeCommand: (name: string, cmd: Command) => void;
  runCommand: (name: string) => Promise<Record<string, string>>;
  addCommand: (command: Command) => void;
  removeCommand: (name: string) => void;
  saveCommand: () => void;
  getCommand: () => void;
}

export const useCommandStore = create<CommandStore>()(
  persist(
    (set, get) => ({
      commands: [],
      history: [],
      command_path: '',

      changeCommand: (name: string, cmd: Command) =>
        set((state) => {
          const cmdPrevIndex = state.commands.findIndex((c) => c.name === name);
          if (cmdPrevIndex !== -1) {
            state.commands[cmdPrevIndex] = cmd;
          }
          return state;
        }),

      setCommandPath: (path) => set(() => ({ command_path: path })),

      runCommand: async (name: string) => {
        const cmd = get().commands.find((c) => c.name === name);
        if (!cmd) throw new Error(`Command "${name}" not found`);

        set((state) => {
          state.history.push(cmd);
          return state;
        });

        console.log('[store/runCommand] executing:', cmd.commands);
        const result = await window.api.runCommand(cmd.commands);
        return result;
      },

      addCommand: (command: Command) =>
        set((state) => ({ commands: [...state.commands, command] })),

      removeCommand: (name: string) =>
        set((state) => ({
          commands: state.commands.filter((c) => name !== c.name),
        })),

      saveCommand: () =>
        set((state) => {
          window.api.store.set('command', state.commands);
          window.api.store.set('history', state.history);
          return state;
        }),

      getCommand: () =>
        set(() => ({
          commands: (window.api.store.get('command') as Command[]) || [],
          history: (window.api.store.get('history') as Command[]) || [],
        })),
    }),

    {
      name: 'command-storage',
    },
  ),
);
