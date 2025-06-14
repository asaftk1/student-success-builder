
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, BookOpen, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ScheduleManagerProps {
  userRole: string;
}

const ScheduleManager = ({ userRole }: ScheduleManagerProps) => {
  const [selectedDay, setSelectedDay] = useState('sunday');
  const [selectedClass, setSelectedClass] = useState('י1');
  
  const daysOfWeek = [
    { value: 'sunday', label: 'ראשון' },
    { value: 'monday', label: 'שני' },
    { value: 'tuesday', label: 'שלישי' },
    { value: 'wednesday', label: 'רביעי' },
    { value: 'thursday', label: 'חמישי' },
  ];

  const timeSlots = [
    '08:00-08:45',
    '08:45-09:30',
    '09:30-10:15',
    '10:30-11:15',
    '11:15-12:00',
    '12:00-12:45',
    '13:30-14:15',
    '14:15-15:00',
  ];

  const [schedule, setSchedule] = useState({
    'י1': {
      sunday: ['מתמטיקה', 'עברית', 'אנגלית', 'הפסקה', 'היסטוריה', 'ספרות', 'הפסקה', 'פיזיקה'],
      monday: ['עברית', 'מתמטיקה', 'אנגלית', 'הפסקה', 'כימיה', 'ביולוגיה', 'הפסקה', 'חינוך גופני'],
    },
    'י2': {
      sunday: ['אנגלית', 'מתמטיקה', 'עברית', 'הפסקה', 'פיזיקה', 'כימיה', 'הפסקה', 'היסטוריה'],
      monday: ['מתמטיקה', 'עברית', 'אנגלית', 'הפסקה', 'ספרות', 'ביולוגיה', 'הפסקה', 'חינוך גופני'],
    }
  });

  const [teachers] = useState([
    { name: 'מורה כהן', subject: 'מתמטיקה', available: true },
    { name: 'מורה לוי', subject: 'עברית', available: false },
    { name: 'מורה ישראל', subject: 'אנגלית', available: true },
    { name: 'מורה דוד', subject: 'היסטוריה', available: true },
    { name: 'מורה שרה', subject: 'פיזיקה', available: false },
  ]);

  const getCurrentSchedule = () => {
    return schedule[selectedClass]?.[selectedDay] || [];
  };

  const generateAutomaticSchedule = () => {
    console.log('יוצר מערכת שעות אוטומטית בהתבסס על זמינות המורים');
    // כאן תהיה הלוגיקה ליצירת מערכת שעות אוטומטית
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">מערכת שעות</h2>
        {userRole === 'admin' && (
          <Button onClick={generateAutomaticSchedule} className="bg-green-600 hover:bg-green-700">
            יצור מערכת אוטומטית
          </Button>
        )}
      </div>

      {/* בחירת פרמטרים */}
      <Card>
        <CardHeader>
          <CardTitle>בחירת כיתה ויום</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <div className="space-y-2">
            <Label>כיתה</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="י1">י1</SelectItem>
                <SelectItem value="י2">י2</SelectItem>
                <SelectItem value="יא1">יא1</SelectItem>
                <SelectItem value="יא2">יא2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>יום</Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* מערכת השעות */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>מערכת שעות - כיתה {selectedClass} - יום {daysOfWeek.find(d => d.value === selectedDay)?.label}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שעה</TableHead>
                <TableHead>מקצוע</TableHead>
                <TableHead>מורה</TableHead>
                <TableHead>סטטוס</TableHead>
                {userRole === 'admin' && <TableHead>פעולות</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((timeSlot, index) => {
                const subject = getCurrentSchedule()[index] || '-';
                const teacher = teachers.find(t => t.subject === subject);
                const isBreak = subject === 'הפסקה';
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{timeSlot}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isBreak ? (
                        <Badge variant="secondary">הפסקה</Badge>
                      ) : (
                        <span>{subject}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isBreak ? '-' : (teacher?.name || 'לא מוגדר')}
                    </TableCell>
                    <TableCell>
                      {isBreak ? (
                        <Badge variant="outline">הפסקה</Badge>
                      ) : teacher?.available ? (
                        <Badge className="bg-green-100 text-green-800">זמין</Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          לא זמין
                        </Badge>
                      )}
                    </TableCell>
                    {userRole === 'admin' && (
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">ערוך</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>ערוך שיעור</DialogTitle>
                              <DialogDescription>
                                עריכת שיעור בשעה {timeSlot}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>מקצוע</Label>
                                <Select defaultValue={subject}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="מתמטיקה">מתמטיקה</SelectItem>
                                    <SelectItem value="עברית">עברית</SelectItem>
                                    <SelectItem value="אנגלית">אנגלית</SelectItem>
                                    <SelectItem value="היסטוריה">היסטוריה</SelectItem>
                                    <SelectItem value="הפסקה">הפסקה</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button className="w-full">שמור שינויים</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* זמינות מורים */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>זמינות מורים היום</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{teacher.name}</h3>
                  {teacher.available ? (
                    <Badge className="bg-green-100 text-green-800">זמין</Badge>
                  ) : (
                    <Badge variant="destructive">לא זמין</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{teacher.subject}</p>
                {userRole === 'admin' && (
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    עדכן זמינות
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">32</div>
              <div className="text-sm text-gray-600">שעות שבועיות</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-gray-600">מורים זמינים</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">6</div>
              <div className="text-sm text-gray-600">הפסקות יומיות</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">מקצועות</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleManager;
