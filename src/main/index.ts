import { app, shell, BrowserWindow, ipcMain, dialog, nativeTheme, Tray, Menu } from 'electron';
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import ElectronStore from 'electron-store';
import robot from 'robotjs';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 250,
    height: 400,
    resizable: true,
    show: true,
    darkTheme: true,
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, '..', 'Update.exe');
  const exeName = path.basename(process.execPath);

  app.setLoginItemSettings({
    openAtLogin: true,
    path: updateExe,
    args: ['--processStart', `"${exeName}"`, '--process-start-args', '"--hidden"'],
  });

  ipcMain.handle('open-dialog', () => {
    dialog
      .showOpenDialog({ properties: ['openFile'] })
      .then((result) => {
        if (!result.canceled) {
          mainWindow.webContents.send('file_path', result.filePaths);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  ipcMain.handle('dark-mode:  system', () => {
    nativeTheme.themeSource = 'system';
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function createTray() {
  let commands: any[] = [];
  const tray = new Tray(icon);
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Команды',
      type: 'submenu',
      submenu: commands.map((cmd) => {
        return {
          label: cmd.name,
          type: 'normal',
          click: () => {
            BrowserWindow.getAllWindows()
              .shift()!
              .webContents.send('runCommandRerender', JSON.stringify(cmd));
          },
        };
      }),
    },
    {
      label: 'Закрыть',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);

  ipcMain.on('do-mouse', (_event, { x, y }) => {
    robot.moveMouse(x, y);
    robot.mouseClick();
  });

  ipcMain.on('do-keyboard', (_event, { keys }) => {
    if (keys.length === 1) {
      robot.keyTap(keys[0]);
    } else {
      const main = keys.pop()!;
      robot.keyTap(main, keys);
    }
  });

  ipcMain.on('getValueReq', (_event, value) => {
    commands = JSON.parse(value);
    contextMenu = Menu.buildFromTemplate([
      {
        label: 'Команды',
        type: 'submenu',
        submenu: commands.map((cmd) => {
          return {
            label: cmd.name,
            type: 'normal',
            click: () => {
              BrowserWindow.getAllWindows()
                .shift()!
                .webContents.send('runCommandRerender', JSON.stringify(cmd));
            },
          };
        }),
      },
      {
        label: 'Закрыть',
        type: 'normal',
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.setContextMenu(contextMenu);
  });

  tray.setToolTip('Goog');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    BrowserWindow.getAllWindows().shift()!.show();
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();
  createTray();

  ElectronStore.initRenderer();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', (_ev) => {
  if (process.platform !== 'darwin') {
    // app.quit()
    BrowserWindow.getAllWindows().shift()!.hide();
  }
});

ipcMain.handle('quit', (_ev) => {
  // app.quit()
  BrowserWindow.getAllWindows().shift()!.hide();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
