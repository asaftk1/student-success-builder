
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BookOpen, BarChart3, MessageSquare, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleLabel, getRolePermissions } from '@/utils/roleUtils';
import StudentManagement from './StudentManagement';
import AttendanceSystem from './AttendanceSystem';
import ScheduleManager from './ScheduleManager';
import GradingSystem from './GradingSystem';
import ExamCalendar from './ExamCalendar';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard = ({ user }: DashboardProps) => {
  const { signOut, userGroup } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  
  const permissions = getRolePermissions(user.role);

  const menuItems = [
    { 
      id: 'overview', 
      label: 'סקירה כללית', 
      icon: BarChart3, 
      condition: true 
    },
    { 
      id: 'students', 
      label: 'ניהול תלמידים', 
      icon: Users, 
      condition: permissions.canManageStudents 
    },
    { 
      id: 'schedule', 
      label: 'מערכת שעות', 
      icon: Calendar, 
      condition: permissions.canManageSchedule || permissions.canViewAttendance 
    },
    { 
      id: 'attendance', 
      label: 'נוכחות וציונים', 
      icon: BookOpen, 
      condition: permissions.canViewAttendance 
    },
    { 
      id: 'grading', 
      label: 'מערכת ציונים', 
      icon: BarChart3, 
      condition: permissions.canManageGrading || permissions.canViewAttendance 
    },
    { 
      id: 'exams', 
      label: 'לוח מבחנים', 
      icon: Calendar, 
      condition: permissions.canManageExams || permissions.canViewAttendance 
    },
    { 
      id: 'messages', 
      label: 'הודעות', 
      icon: MessageSquare, 
      condition: true 
    },
  ];

  const visibleMenuItems = menuItems.filter(item => item.condition);

  const renderContent = () => {
    switch (activeSection) {
      case 'students':
        return <StudentManagement />;
      case 'attendance':
        return <AttendanceSystem userRole={user.role} />;
      case 'schedule':
        return <ScheduleManager userRole={user.role} />;
      case 'grading':
        return <GradingSystem userRole={user.role} />;
      case 'exams':
        return <ExamCalendar userRole={user.role} />;
      case 'overview':
      default:
        return <DashboardOverview userRole={user.role} userGroup={userGroup} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">מערכת בית ספר</h1>
          <p className="text-sm text-gray-600">{user.full_name || user.email}</p>
          <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
          {userGroup && (
            <p className="text-xs text-blue-600 font-medium">קבוצת {userGroup.name}</p>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            התנתק
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
};

const DashboardOverview = ({ userRole, userGroup }: { userRole: string, userGroup: any }) => {
  const permissions = getRolePermissions(userRole);
  
  const stats = [
    { title: 'סה"כ תלמידים', value: '342', change: '+12 השבוע', color: 'bg-blue-500' },
    { title: 'מורים פעילים', value: '28', change: '2 חדשים', color: 'bg-green-500' },
    { title: 'ממוצע נוכחות', value: '87%', change: '+3% מחודש שעבר', color: 'bg-yellow-500' },
    { title: 'מבחנים השבוע', value: '15', change: '8 ממתינים', color: 'bg-purple-500' },
  ];

  // אם המשתמש הוא מדריך או רכז קבוצה - נציג סטטיסטיקות רק של הקבוצה שלו
  const groupSpecificTitle = userGroup ? 
    (userRole === 'instructor' || userRole === 'group_coordinator') ? 
      `סקירה כללית - קבוצת ${userGroup.name}` : 
      'סקירה כללית' : 
    'סקירה כללית';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{groupSpecificTitle}</h2>
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          3 התראות חדשות
        </Button>
      </div>

      {/* הצגת הרשאות המשתמש */}
      {(userRole === 'instructor' || userRole === 'group_coordinator') && userGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">מידע על התפקיד</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                {userRole === 'instructor' ? 
                  `כמדריך קבוצת ${userGroup.name}, תוכל לצפות בנתונים של התלמידים שלך בלבד` :
                  `כרכז קבוצת ${userGroup.name}, תוכל לנהל את כל הנתונים של הקבוצה שלך`
                }
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {permissions.canViewAttendance && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">צפיה בנוכחות</span>
                )}
                {permissions.canManageGrading && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">ניהול ציונים</span>
                )}
                {permissions.canManageSchedule && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">ניהול מערכת שעות</span>
                )}
                {permissions.canManageStudents && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">ניהול תלמידים</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>פעילות אחרונה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">מורה חדש נרשם למערכת</span>
              <span className="text-xs text-gray-500">לפני 2 שעות</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">עודכנה מערכת השעות לכיתה י'</span>
              <span className="text-xs text-gray-500">לפני 4 שעות</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">נוספו 3 מבחנים חדשים</span>
              <span className="text-xs text-gray-500">אתמול</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>הודעות מהנהלה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">ישיבת צוות חשובה</p>
              <p className="text-xs text-gray-600">מחר בשעה 14:00 בחדר המורים</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium">שינוי במערכת השעות</p>
              <p className="text-xs text-gray-600">יום רביעי יהיו שינויים במערכת</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
