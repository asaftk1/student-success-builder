
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, BookOpen, BarChart3, MessageSquare, Settings, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'סקירה כללית', icon: BarChart3, roles: ['admin', 'coordinator', 'teacher'] },
    { id: 'students', label: 'ניהול תלמידים', icon: Users, roles: ['admin', 'coordinator'] },
    { id: 'schedule', label: 'מערכת שעות', icon: Calendar, roles: ['admin', 'coordinator', 'teacher'] },
    { id: 'attendance', label: 'נוכחות וציונים', icon: BookOpen, roles: ['teacher', 'coordinator'] },
    { id: 'grading', label: 'מערכת ציונים', icon: BarChart3, roles: ['teacher', 'coordinator'] },
    { id: 'exams', label: 'לוח מבחנים', icon: Calendar, roles: ['admin', 'coordinator', 'teacher'] },
    { id: 'messages', label: 'הודעות', icon: MessageSquare, roles: ['admin', 'coordinator', 'teacher'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));

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
        return <DashboardOverview userRole={user.role} />;
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">מערכת בית ספר</h1>
          <p className="text-sm text-gray-600">{user.full_name || user.email} - {getRoleLabel(user.role)}</p>
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

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'מנהל';
    case 'coordinator': return 'רכז פדגוגי';
    case 'teacher': return 'מורה';
    default: return role;
  }
};

const DashboardOverview = ({ userRole }: { userRole: string }) => {
  const stats = [
    { title: 'סה"כ תלמידים', value: '342', change: '+12 השבוע', color: 'bg-blue-500' },
    { title: 'מורים פעילים', value: '28', change: '2 חדשים', color: 'bg-green-500' },
    { title: 'ממוצע נוכחות', value: '87%', change: '+3% מחודש שעבר', color: 'bg-yellow-500' },
    { title: 'מבחנים השבוע', value: '15', change: '8 ממתינים', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">סקירה כללית</h2>
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          3 התראות חדשות
        </Button>
      </div>

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
