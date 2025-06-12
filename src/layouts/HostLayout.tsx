import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Footer2 } from '@/components/footer2';
import { NavbarHost } from '@/components/ui/navbar-host';

const HostLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarHost />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer2 />

    </div>
  );
};

export default HostLayout; 