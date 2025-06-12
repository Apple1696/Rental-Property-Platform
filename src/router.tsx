import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import Home from './pages/Home/Home'
import LoginPage from './pages/Login/Login'
import Properties from './pages/Properties/Properties'
import PropertyDetail from './pages/Properties/PropertyDetail'
// import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from './pages/Dashboard/page'
import { ForgotPasswordForm } from './components/login/forgot-password'
import { ResetPasswordForm } from './components/login/reset-password'
import PaymentSuccess from './pages/Payment/PaymentSuccess'
import PaymentFail from './pages/Payment/PaymentFail'
import RegisterConfirm from './pages/Register/RegisterSuccess'
import RegisterFail from './pages/Register/RegisterFail'
import { EmailConfirmation } from './components/login/email-confirmation'
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
      },
     
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
    path: '/user/forget-password',
    element: <ForgotPasswordForm/>
  },
  {
    path: '/user/reset-password',
    element: <ResetPasswordForm/>
  },
  {
    path: 'payment-success',
    element: <PaymentSuccess/>
  },
  {
    path: 'payment-failed',
    element: <PaymentFail/>
  },
  {
    path: 'register-success',
    element: <RegisterConfirm/>
  },
  {
    path: 'register-fail',
    element: <RegisterFail/>
  },
  {
    path: 'user/confirm',
    element: <EmailConfirmation/>
  }
]) 