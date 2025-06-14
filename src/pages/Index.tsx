
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import PendingApproval from '@/components/PendingApproval';
import Dashboard from '@/components/Dashboard';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const { user, profile, loading, isApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show auth page
  if (!user || !profile) {
    return <AuthPage />;
  }

  // Logged in but not approved - show pending approval
  if (!isApproved) {
    return <PendingApproval />;
  }

  // Admin user - show admin panel
  if (profile.role === 'admin') {
    return <AdminPanel />;
  }

  // Approved user - show dashboard
  return <Dashboard user={profile} onLogout={() => {}} />;
};

export default Index;
