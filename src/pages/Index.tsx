
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BookOpen, BarChart3, MessageSquare, Settings } from 'lucide-react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
};

export default Index;
