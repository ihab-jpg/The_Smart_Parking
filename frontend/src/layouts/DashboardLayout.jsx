import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="app-shell min-h-screen">
      <Navbar user={session.user} onLogout={handleLogout} />
      <Outlet />
    </div>
  );
}
