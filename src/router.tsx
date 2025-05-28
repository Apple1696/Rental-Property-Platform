import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import Home from './pages/Home/Home'
import LoginPage from './pages/Login/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
]) 