import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import HostLayout from '@/layouts/HostLayout'
import Home from './pages/Home/Home'
import LoginPage from './pages/Login/Login'
import Properties from './pages/Properties/Properties'
import PropertyDetail from './pages/Properties/PropertyDetail'
// import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from './pages/Dashboard/Dashboard'
import { ForgotPasswordForm } from './components/login/forgot-password'
import { ResetPasswordForm } from './components/login/reset-password'
import PaymentSuccess from './pages/Payment/PaymentSuccess'
import PaymentFail from './pages/Payment/PaymentFail'
import RegisterConfirm from './pages/Register/RegisterSuccess'
import RegisterFail from './pages/Register/RegisterFail'
import { EmailConfirmation } from './components/login/email-confirmation'
import PropertyListing from './pages/Host/PropertyListing'
import AddProperty from './pages/Host/AddProperty'
import ViewDetail from './pages/Host/ViewDetail'
import UpdateProperty from './pages/Host/UpdateProperty'
import CheckOut from './pages/Payment/CheckOut'
import MyBookingPage from './pages/MyBooking'
import FinancePage from './pages/Dashboard/Finance/FinancePage'
import ReviewsPage from './pages/Dashboard/Reviews/ReviewsPage'

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
      {
        path: 'payment/:id',
        element: <CheckOut/>
      },
      {
        path: 'my-bookings',
        element: <MyBookingPage/>
      },
     
    ]
  },
  {
    path: '/hosting',
    element: <HostLayout />,
    children: [
      {
        index: true,
        element: <PropertyListing />
      },
      {
        path: 'add-property',
        element: <AddProperty />
      },
      {
        path: 'properties/:id',
        element: <ViewDetail />
      },
      {
        path: 'properties/:id/edit',
        element: <UpdateProperty />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
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
    element: <PaymentSuccess/>,
  },
  {
    path: 'payment-failed',
    element: <PaymentFail/>,
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
  },
   {
        path: 'admin/dashboard',
        element: <Dashboard />
      },
      {
        path: 'admin/finance',
        element: <FinancePage />
      },
         {
        path: 'admin/reviews',
        element: <ReviewsPage />
      },
]) 