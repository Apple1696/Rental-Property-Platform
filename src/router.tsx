import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import Home from './pages/Home/Home'
import LoginPage from './pages/Login/Login'
import Properties from './pages/Properties/Properties'
import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from './pages/Dashboard/page'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'properties',
        element: <ProtectedRoute><Properties /></ProtectedRoute>
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path:'/dashboard',
    element: <Dashboard/>
  }
]) 