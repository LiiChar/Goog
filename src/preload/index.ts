import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { exec } from 'child_process';
import Store from 'electron-store';
import util from 'util';

const execAsync = util.promisify(exec);
const store = new Store();

const IStore = ['history', 'command'] as const;

export type MethodExecute = 'browser' | 'cmd' | 'steam' | 'mouse' | 'keyboard' | 'wait';

export type ExecuteAccomplition = 'sync' | 'async';

export type CommandElement = {
  method: MethodExecute;
  command: string;
  accomplition: ExecuteAccomplition;
};

export const api = {
  path: '',

  runCommand: async (commands: CommandElement[]) => {
    let result: Record<string, string> = {};
    let cwd = process.cwd();

    console.log('[runCommand] commands:', commands);

    const executeOne = async (cmd: CommandElement) => {
      ipcRenderer.send('command-status', { cmd, status: 'started' });

      try {
        if (cmd.method === 'cmd') {
          if (cmd.command.toLowerCase().startsWith('cd ')) {
            const newPath = cmd.command.substring(3).trim().replace(/['"]+/g, '');
            cwd = newPath;
            return `Changed directory to ${cwd}`;
          }

          const { stdout, stderr } = await execAsync(`cmd.exe /c ${cmd.command}`, {
            cwd,
            windowsHide: true,
            env: process.env,
          });
          return stdout || stderr;
        }

        if (cmd.method === 'browser') {
          await execAsync(`cmd.exe /c start "" "${cmd.command}"`, {
            cwd,
            windowsHide: true,
            env: process.env,
          });
          return `Opened browser: ${cmd.command}`;
        }

        if (cmd.method === 'steam') {
          await execAsync(`cmd.exe /c start steam://rungameid/${cmd.command}`, {
            cwd,
            windowsHide: true,
            env: process.env,
          });
          return `Launched Steam game: ${cmd.command}`;
        }

        if (cmd.method === 'mouse') {
          const [x, y] = cmd.command.split(',').map((n) => parseInt(n.trim(), 10));
          api.mouseMove(x, y);
          return `Mouse clicked at ${x},${y}`;
        }

        if (cmd.method === 'keyboard') {
          const keys = cmd.command.split('+').map((k) => k.trim().toLowerCase());
          api.keyPress(keys);
          return `Pressed keys: ${cmd.command}`;
        }

        if (cmd.method === 'wait') {
          const ms = parseInt(cmd.command, 10);
          await new Promise((res) => setTimeout(res, ms));
          return `Waited ${ms} ms`;
        }

        return `Unknown method: ${cmd.method}`;
      } catch (error: any) {
        throw new Error(error.message);
      }
    };

    for (let cmd of commands) {
      if (cmd.accomplition === 'async') {
        try {
          const output = await executeOne(cmd);
          result[cmd.command] = output;
          console.log('[runCommand] output:', output);
          ipcRenderer.send('command-status', {
            cmd: cmd.command,
            status: 'success',
            output,
          });
        } catch (error: any) {
          result[cmd.command] = `Command error: ${cmd.command}\n${error.message}`;
          ipcRenderer.send('command-status', {
            cmd: cmd.command,
            status: 'error',
            output: error.message,
          });
        }
      } else {
        // async — не ждём, сразу запускаем
        executeOne(cmd)
          .then((output) => {
            result[cmd.command] = output;
            ipcRenderer.send('command-status', {
              cmd: cmd.command,
              status: 'success',
              output,
            });
          })
          .catch((error: any) => {
            result[cmd.command] = `Command error: ${cmd.command}\n${error.message}`;
            ipcRenderer.send('command-status', {
              cmd: cmd.command,
              status: 'error',
              output: error.message,
            });
          });
      }
    }

    return result;
  },
  mouseMove: (x: number, y: number) => {
    ipcRenderer.send('do-mouse', { x, y });
  },
  keyPress: (keys: string[]) => {
    ipcRenderer.send('do-keyboard', { keys });
  },
  quit: () => {
    ipcRenderer.invoke('quit');
  },
  onCommandStatus: (callback: (data: any) => void) => {
    ipcRenderer.on('command-status', (_event, data) => callback(data));
  },
  onCommandRes: (value: string) => {
    ipcRenderer.send('getValueReq', value);
    ipcRenderer.on('runCommandRerender', (_event, value) => {
      api.runCommand(JSON.parse(value).commands);
    });
  },
  store: {
    set: (key: (typeof IStore)[number], value: any) => {
      store.set(key, value);
    },
    get: (key: (typeof IStore)[number]) => {
      return store.get(key);
    },
  },
  openModal: async (callback: (value: string) => void) => {
    ipcRenderer.invoke('open-dialog');
    ipcRenderer.once('file_path', (_event, value) => {
      callback(value);
    });
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('darkMode', {
      toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
      system: () => ipcRenderer.invoke('dark-mode:system'),
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore
  window.electron = electronAPI;
  // @ts-ignore
  window.api = api;
}
