import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { Setting } from './pages/setting/Setting';
import { Command } from './pages/command/Command';
import { CommandAdd } from './pages/command-add/CommandAdd';
import { Main } from './pages/main/Main';
import './global.scss';
import { Root } from './components/layout/root/Root';

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/setting',
        element: <Setting />,
      },
      {
        path: '/command/:command',
        element: <Command />,
      },
      {
        path: '/add',
        element: <CommandAdd />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
