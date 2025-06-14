
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, BookOpen, AlertCircle, Plus, Bell } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ExamCalendarProps {
  userRole: string;
}

const ExamCalendar = ({ userRole }: ExamCalendarProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [exams, setExams] = useState([
    {
      id: 1,
      title: 'מבחן מתמטיקה - גיאומטריה',
      subject: 'מתמטיקה',
      class: 'י1',
      date: '2024-01-15',
      time: '09:00',
      duration: 90,
      teacher: 'מורה כהן',
      type: 'exam',
      description: 'מבחן בנושא גיאומטריה אנליטית'
    },
    {
      id: 2,
      title: 'עבודת מחקר - ספרות',
      subject: 'ספרות',
      class: 'י2',
      date: '2024-01-18',
      time: '14:00',
      duration: 120,
      teacher: 'מורה לוי',
      type: 'assignment',
      description: 'עבודת מחקר על יצירות ש"י עגנון'
    },
    {
      id: 3,
      title: 'מבחן אנגלית - דקדוק',
      subject: 'אנגלית',
      class: 'י1',
      date: '2024-01-20',
      time: '10:30',
      duration: 60,
      teacher: 'מורה ישראל',
      type: 'exam',
      description: 'מבחן בנושא זמנים באנגלית'
    },
  ]);

  const [newExam, setNewExam] = useState({
    title: '',
    subject: '',
    class: '',
    date: '',
    time: '',
    duration: '',
    type: 'exam',
    description: ''
  });

  const addExam = () => {
    if (newExam.title && newExam.subject && newExam.class && newExam.date) {
      setExams([...exams, {
        id: exams.length + 1,
        ...newExam,
        duration: parseInt(newExam.duration) || 60,
        teacher: 'המורה הנוכחי'
      }]);
      setNewExam({
        title: '',
        subject: '',
        class: '',
        date: '',
        time: '',
        duration: '',
        type: 'exam',
        description: ''
      });
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'exam' ? 'מבחן' : 'עבודה';
  };

  const getTypeColor = (type: string) => {
    return type === 'exam' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const isUpcoming = (date: string) => {
    const examDate = new Date(date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const upcomingExams = exams.filter(exam => isUpcoming(exam.date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">לוח מבחנים ועבודות</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-yellow-50 border-yellow-200">
            <Bell className="w-4 h-4 mr-2" />
            {upcomingExams.length} התראות
          </Button>
          {(userRole === 'teacher' || userRole === 'admin') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  הוסף מבחן/עבודה
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>הוסף מבחן או עבודה</DialogTitle>
                  <DialogDescription>הגדר מבחן או עבודה חדשה בלוח השנה</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>כותרת</Label>
                    <Input
                      value={newExam.title}
                      onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                      placeholder="לדוגמה: מבחן מתמטיקה - אלגברה"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>סוג</Label>
                    <Select value={newExam.type} onValueChange={(value) => setNewExam({...newExam, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">מבחן</SelectItem>
                        <SelectItem value="assignment">עבודה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>מקצוע</Label>
                    <Select value={newExam.subject} onValueChange={(value) => setNewExam({...newExam, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מקצוע" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="מתמטיקה">מתמטיקה</SelectItem>
                        <SelectItem value="עברית">עברית</SelectItem>
                        <SelectItem value="אנגלית">אנגלית</SelectItem>
                        <SelectItem value="היסטוריה">היסטוריה</SelectItem>
                        <SelectItem value="ספרות">ספרות</SelectItem>
                        <SelectItem value="פיזיקה">פיזיקה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>כיתה</Label>
                    <Select value={newExam.class} onValueChange={(value) => setNewExam({...newExam, class: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר כיתה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="י1">י1</SelectItem>
                        <SelectItem value="י2">י2</SelectItem>
                        <SelectItem value="יא1">יא1</SelectItem>
                        <SelectItem value="יא2">יא2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>תאריך</Label>
                      <Input
                        type="date"
                        value={newExam.date}
                        onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>שעה</Label>
                      <Input
                        type="time"
                        value={newExam.time}
                        onChange={(e) => setNewExam({...newExam, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>משך זמן (דקות)</Label>
                    <Input
                      type="number"
                      value={newExam.duration}
                      onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>תיאור</Label>
                    <Textarea
                      value={newExam.description}
                      onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                      placeholder="תיאור נוסף על המבחן או העבודה"
                      rows={3}
                    />
                  </div>
                  <Button onClick={addExam} className="w-full">הוסף ללוח השנה</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* התראות מבחנים קרובים */}
      {upcomingExams.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <span>מבחנים קרובים השבוע</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <h3 className="font-medium">{exam.title}</h3>
                    <p className="text-sm text-gray-600">
                      {exam.class} - {new Date(exam.date).toLocaleDateString('he-IL')} בשעה {exam.time}
                    </p>
                  </div>
                  <Badge className={getTypeColor(exam.type)}>
                    {getTypeLabel(exam.type)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* לוח המבחנים */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>לוח מבחנים ועבודות</span>
          </CardTitle>
          <CardDescription>כל המבחנים והעבודות המתוכננים</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תאריך</TableHead>
                <TableHead>שעה</TableHead>
                <TableHead>כותרת</TableHead>
                <TableHead>מקצוע</TableHead>
                <TableHead>כיתה</TableHead>
                <TableHead>סוג</TableHead>
                <TableHead>משך זמן</TableHead>
                <TableHead>מורה</TableHead>
                {(userRole === 'teacher' || userRole === 'admin') && <TableHead>פעולות</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((exam) => (
                <TableRow key={exam.id} className={isUpcoming(exam.date) ? 'bg-yellow-50' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(exam.date).toLocaleDateString('he-IL')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{exam.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{exam.title}</div>
                      {exam.description && (
                        <div className="text-sm text-gray-600 mt-1">{exam.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span>{exam.subject}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{exam.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(exam.type)}>
                      {getTypeLabel(exam.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{exam.duration} דקות</TableCell>
                  <TableCell>{exam.teacher}</TableCell>
                  {(userRole === 'teacher' || userRole === 'admin') && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">ערוך</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">מחק</Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{exams.filter(e => e.type === 'exam').length}</div>
              <div className="text-sm text-gray-600">מבחנים מתוכננים</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{exams.filter(e => e.type === 'assignment').length}</div>
              <div className="text-sm text-gray-600">עבודות מתוכננות</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{upcomingExams.length}</div>
              <div className="text-sm text-gray-600">השבוע הקרוב</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(exams.reduce((acc, e) => acc + e.duration, 0) / exams.length)}</div>
              <div className="text-sm text-gray-600">ממוצע משך זמן (דקות)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamCalendar;
