
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, UserX, LogOut, Users, Calendar, BookOpen, BarChart3, MessageSquare, Settings, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getRoleLabel } from '@/utils/roleUtils';
import StudentManagement from './StudentManagement';
import AttendanceSystem from './AttendanceSystem';
import ScheduleManager from './ScheduleManager';
import GradingSystem from './GradingSystem';
import ExamCalendar from './ExamCalendar';

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
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'coordinator' | 'teacher'>('teacher');

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
      console.log('Raw data from database:', data);
      const mappedUsers = data.map(user => {
        console.log(`User ${user.email} has role: "${user.role}" (type: ${typeof user.role})`);
        return { ...user, role: user.role as 'admin' | 'coordinator' | 'teacher' };
      });
      console.log('Mapped users:', mappedUsers);
      setUsers(mappedUsers);
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

  const updateUserRole = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: selectedRole })
      .eq('id', editingUser.id);

    if (error) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן היה לעדכן את תפקיד המשתמש"
      });
    } else {
      toast({
        title: "עודכן בהצלחה",
        description: `תפקיד המשתמש עודכן ל${getRoleLabel(selectedRole)}`
      });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    }
  };

  const openEditDialog = (user: Profile) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsEditDialogOpen(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'students':
        return <StudentManagement />;
      case 'attendance':
        return <AttendanceSystem userRole="admin" />;
      case 'schedule':
        return <ScheduleManager userRole="admin" />;
      case 'grading':
        return <GradingSystem userRole="admin" />;
      case 'exams':
        return <ExamCalendar userRole="admin" />;
      case 'users':
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                רשימת משתמשים
                <Badge variant="secondary">{users.length}</Badge>
              </CardTitle>
              <CardDescription>
                כאן תוכל לאשר או לדחות משתמשים חדשים במערכת ולעדכן תפקידים
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => {
                  console.log(`Rendering user ${user.email} with role: "${user.role}"`);
                  console.log(`getRoleLabel("${user.role}") = "${getRoleLabel(user.role)}"`);
                  return (
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
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          עריכה
                        </Button>
                        
                        {!user.is_approved && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    אין משתמשים רשומים במערכת כרגע
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">פאנל ניהול מנהל</h1>
            <p className="text-gray-600 mt-2">ניהול מלא של מערכת בית הספר</p>
          </div>
          <Button onClick={signOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            התנתק
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              ניהול משתמשים
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              ניהול תלמידים
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              מערכת שעות
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              נוכחות וציונים
            </TabsTrigger>
            <TabsTrigger value="grading" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              מערכת ציונים
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              לוח מבחנים
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {renderTabContent()}
          </TabsContent>
          
          <TabsContent value="students" className="space-y-6">
            {renderTabContent()}
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6">
            {renderTabContent()}
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-6">
            {renderTabContent()}
          </TabsContent>
          
          <TabsContent value="grading" className="space-y-6">
            {renderTabContent()}
          </TabsContent>
          
          <TabsContent value="exams" className="space-y-6">
            {renderTabContent()}
          </TabsContent>
        </Tabs>

        {/* Role Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>עריכת תפקיד משתמש</DialogTitle>
              <DialogDescription>
                עדכן את התפקיד של {editingUser?.full_name || editingUser?.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">תפקיד:</label>
              <Select value={selectedRole} onValueChange={(value: 'admin' | 'coordinator' | 'teacher') => setSelectedRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר תפקיד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">מנהל</SelectItem>
                  <SelectItem value="coordinator">רכז פדגוגי</SelectItem>
                  <SelectItem value="teacher">מורה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                ביטול
              </Button>
              <Button onClick={updateUserRole}>
                שמור שינויים
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPanel;
