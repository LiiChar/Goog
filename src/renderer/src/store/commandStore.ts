import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import _ from 'lodash'

export interface ICommand {
  name: string
  description?: string
  commands: string[]
}

interface CommandStore {
  command_path: string
  commands: ICommand[]
  history: ICommand[]
  setCommandPath: (path: string) => void
  changeCommand: (name: string, cmd: ICommand) => void
  runCommand: (name: string) => Promise<string[]>
  addCommand: (command: ICommand) => void
  removeCommand: (name: string) => void
  saveCommand: () => void
  getCommand: () => void
}

export const useCommandStore = create<CommandStore>()(
  persist(
    (set) => ({
      commands: [],
      history: [],
      command_path: '',
      changeCommand: (name: string, cmd: ICommand) =>
        set((state) => {
          const cmdPrevIndex = state.commands.findIndex((cmd) => cmd.name == name)!
          state.commands[cmdPrevIndex] = cmd
          return state
        }),
      setCommandPath: (path) => set(() => ({ command_path: path })),
      runCommand: async (name: string) => {
        let command: string[] = []
        set((state) => {
          const cmd = state.commands.find((command) => command.name == name)
          command = cmd!.commands
          state.history.push(cmd!)
          return state
        })
        const result: string[] = await window.api.runCommand(command)
        return result
      },
      addCommand: (command: ICommand) =>
        set((state) => ({ commands: [...state.commands, command] })),
      removeCommand: (name: string) =>
        set((state) => ({ commands: state.commands.filter((command) => name != command.name) })),
      saveCommand: () =>
        set((state) => {
          window.api.store.set('command', state.commands)
          window.api.store.set('history', state.history)
          return state
        }),
      getCommand: () =>
        set(() => ({
          commands: window.api.store.get('command')!,
          history: window.api.store.get('history')!
        }))
    }),

    {
      name: 'command-storage'
    }
  )
)
