import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HostLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default HostLayout; 