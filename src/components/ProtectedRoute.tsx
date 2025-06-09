// import { Navigate } from 'react-router-dom';
// import { authService } from '@/services/authentication';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const isAuthenticated = authService.isAuthenticated();

//   if (!isAuthenticated) {
//     // Redirect to login page if not authenticated
//     return <Navigate to="/login" />;
//   }

//   return <>{children}</>;
// } 