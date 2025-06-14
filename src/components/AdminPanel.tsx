
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'coordinator' | 'teacher';
  is_approved: boolean;
  created_at: string;
}

const AdminPanel = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את רשימת המשתמשים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApproval = async (userId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: isApproved })
        .eq('id', userId);

      if (error) throw error;

      setProfiles(profiles.map(profile => 
        profile.id === userId 
          ? { ...profile, is_approved: isApproved }
          : profile
      ));

      toast({
        title: isApproved ? "משתמש אושר" : "אישור בוטל",
        description: isApproved 
          ? "המשתמש יכול כעת לגשת למערכת" 
          : "גישת המשתמש למערכת בוטלה"
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את סטטוס המשתמש",
        variant: "destructive"
      });
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coordinator': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  const pendingUsers = profiles.filter(p => !p.is_approved);
  const approvedUsers = profiles.filter(p => p.is_approved);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Users className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span>ממתינים לאישור ({pendingUsers.length})</span>
          </CardTitle>
          <CardDescription>
            משתמשים שנרשמו למערכת וממתינים לאישור שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">אין משתמשים הממתינים לאישור</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-yellow-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{profile.full_name || 'ללא שם'}</h3>
                      <Badge className={getRoleBadgeColor(profile.role)}>
                        {getRoleLabel(profile.role)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                    <p className="text-xs text-gray-500">
                      נרשם: {new Date(profile.created_at).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateApproval(profile.id, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      אשר
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateApproval(profile.id, false)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      דחה
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>משתמשים מאושרים ({approvedUsers.length})</span>
          </CardTitle>
          <CardDescription>
            משתמשים שיכולים לגשת למערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">אין משתמשים מאושרים</p>
          ) : (
            <div className="space-y-4">
              {approvedUsers.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{profile.full_name || 'ללא שם'}</h3>
                      <Badge className={getRoleBadgeColor(profile.role)}>
                        {getRoleLabel(profile.role)}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">מאושר</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateApproval(profile.id, false)}
                  >
                    בטל אישור
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
