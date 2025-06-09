import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import Home from './pages/Home/Home'
import LoginPage from './pages/Login/Login'
import Properties from './pages/Properties/Properties'
import PropertyDetail from './pages/Properties/PropertyDetail'
// import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from './pages/Dashboard/page'
import { ForgotPasswordForm } from './components/login/forgot-password'
import { ChangePasswordForm } from './components/login/change-password'
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
        element: <Properties/>
      },
      {
        path: 'properties/:id',
        element: <PropertyDetail/>
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
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordForm/>
  },
  {
    path: '/change-password',
    element: <ChangePasswordForm/>
  }
]) 