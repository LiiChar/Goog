import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { exec } from 'child_process'
import Store from 'electron-store'
// import path from 'path'
// import modal from 'electron-modal'

const store = new Store()

const IStore = ['history', 'command'] as const

// Custom APIs for renderer
export const api = {
  path: '',
  runCommand: async (commands: string[]): Promise<string[]> => {
    let result: string[] = []
    for (let cmd of commands) {
      if (cmd.trim().includes(' ')) {
        exec(`"${cmd}"`, { encoding: 'utf8' }, (error, stdout, _stderr) => {
          if (error) {
            console.error(`exec error: ${error}`)
            return
          }
          result.push(`Command: ${cmd} \n${stdout.toString()}`)
        })
        // result.push(`Command: ${cmd} \n${stdout.toString('utf8')}`)
      } else {
        exec(cmd, { encoding: 'utf8' }, (error, stdout, _stderr) => {
          if (error) {
            console.error(`exec error: ${error}`)
            return
          }
          result.push(`Command: ${cmd} \n${stdout.toString()}`)
        })
        // result.push(`Command: ${cmd} \n${stdout.toString('utf8')}`)
      }
    }
    return result
  },
  quit: () => {
    ipcRenderer.invoke('quit')
  },
  onCommandRes: (value) => {
    ipcRenderer.send('getValueReq', value)
    ipcRenderer.on('runCommandRerender', (_event, value) => {
      api.runCommand(JSON.parse(value).commands)
    })
  },
  store: {
    set: (key: (typeof IStore)[number], value: any) => {
      store.set(key, value)
    },
    get: (key: (typeof IStore)[number]) => {
      store.get(key)
    }
  },
  openModal: async (callback) => {
    ipcRenderer.invoke('open-dialog')
    ipcRenderer.once('file_path', (_event, value) => {
      callback(value)
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('darkMode', {
      toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
      system: () => ipcRenderer.invoke('dark-mode:system')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
