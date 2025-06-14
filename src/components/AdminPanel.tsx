import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'coordinator' | 'teacher';
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

const AdminPanel = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();

    const subscription = supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Change received!', payload)
          fetchUsers();
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן היה לטעון את רשימת המשתמשים"
      });
    } else {
      setUsers(data.map(user => ({ ...user, role: user.role as 'admin' | 'coordinator' | 'teacher' })));
    }
    setLoading(false);
  };

  const updateUserApproval = async (userId: string, isApproved: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: isApproved })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן היה לעדכן את סטטוס המשתמש"
      });
    } else {
      toast({
        title: "עודכן בהצלחה",
        description: `המשתמש ${isApproved ? 'אושר' : 'נדחה'} בהצלחה`
      });
      fetchUsers();
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'מנהל';
      case 'coordinator': return 'רכז פדגוגי';
      case 'teacher': return 'מורה';
      default: return role;
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">פאנל ניהול</h1>
            <p className="text-gray-600 mt-2">ניהול משתמשים ואישורים</p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            התנתק
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              רשימת משתמשים
              <Badge variant="secondary">{users.length}</Badge>
            </CardTitle>
            <CardDescription>
              כאן תוכל לאשר או לדחות משתמשים חדשים במערכת
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{user.full_name || 'ללא שם'}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge variant={user.is_approved ? 'default' : 'destructive'}>
                        {user.is_approved ? 'מאושר' : 'ממתין לאישור'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      נרשם: {new Date(user.created_at).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                  
                  {!user.is_approved && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateUserApproval(user.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        אשר
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateUserApproval(user.id, false)}
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        דחה
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  אין משתמשים רשומים במערכת כרגע
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
