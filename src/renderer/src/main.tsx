import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import { SettingPage } from './Page/SettingPage/SettingPage'
import { CommandPage } from './Page/CommandPage/CommandPage'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { CommandModal } from "./components/Modals/Command/CommandModal";

const router = createHashRouter([
  {
    path: '/',
    element: <>
      <Header />
      <App />
      <Footer />
      <CommandModal />
    </>
  },
  {
    path: '/setting',
    element: <>
      <Header />
      <SettingPage />
      <Footer />
      <CommandModal />
    </>
  },
  {
    path: '/command',
    element: <>
      <Header />
      <CommandPage />
      <Footer />
      <CommandModal />
    </>
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
