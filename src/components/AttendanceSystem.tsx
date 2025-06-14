
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceSystemProps {
  userRole: string;
}

const AttendanceSystem = ({ userRole }: AttendanceSystemProps) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students] = useState([
    { id: 1, name: 'יוסף כהן', present: true, grade: 4 },
    { id: 2, name: 'דוד לוי', present: true, grade: 3 },
    { id: 3, name: 'משה ישראל', present: false, grade: 0 },
    { id: 4, name: 'אברהם גולד', present: true, grade: 5 },
    { id: 5, name: 'יעקב שמואל', present: true, grade: 4 },
  ]);

  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => ({
      ...acc,
      [student.id]: { present: student.present, grade: student.grade }
    }), {})
  );

  const handleAttendanceChange = (studentId: number, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], present }
    }));
  };

  const handleGradeChange = (studentId: number, grade: number) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], grade }
    }));
  };

  const saveAttendance = () => {
    console.log('שמירת נוכחות:', { selectedClass, selectedSubject, selectedDate, attendance });
    // כאן יהיה השמירה למסד הנתונים
  };

  const gradeParameters = [
    'השתתפות בשיעור',
    'הבנת החומר',
    'ביצוע משימות',
    'התנהגות',
    'יוזמה'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">נוכחות וציונים</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">היום: {new Date().toLocaleDateString('he-IL')}</span>
        </div>
      </div>

      {/* בחירת פרמטרים */}
      <Card>
        <CardHeader>
          <CardTitle>בחירת שיעור</CardTitle>
          <CardDescription>בחר כיתה, מקצוע ותאריך לרישום נוכחות</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>כיתה</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
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
          <div className="space-y-2">
            <Label>מקצוע</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מקצוע" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">מתמטיקה</SelectItem>
                <SelectItem value="hebrew">עברית</SelectItem>
                <SelectItem value="english">אנגלית</SelectItem>
                <SelectItem value="history">היסטוריה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>תאריך</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full">טען רשימת תלמידים</Button>
          </div>
        </CardContent>
      </Card>

      {/* רשימת תלמידים ונוכחות */}
      {selectedClass && selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle>רישום נוכחות וציונים - {selectedClass} - {selectedSubject}</CardTitle>
            <CardDescription>סמן נוכחות ותן ציון מ-1 עד 5 לכל תלמיד</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>תלמיד</TableHead>
                  <TableHead>נוכחות</TableHead>
                  <TableHead>ציון (1-5)</TableHead>
                  <TableHead>סטטוס</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={attendance[student.id]?.present || false}
                          onCheckedChange={(checked) => 
                            handleAttendanceChange(student.id, checked as boolean)
                          }
                        />
                        <span className="text-sm">
                          {attendance[student.id]?.present ? 'נוכח' : 'נעדר'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={attendance[student.id]?.grade?.toString() || '0'}
                        onValueChange={(value) => handleGradeChange(student.id, parseInt(value))}
                        disabled={!attendance[student.id]?.present}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">-</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {attendance[student.id]?.present ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          נוכח
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          נעדר
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline">ביטול</Button>
              <Button onClick={saveAttendance} className="bg-blue-600 hover:bg-blue-700">
                שמור נוכחות וציונים
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* פרמטרי ציון */}
      <Card>
        <CardHeader>
          <CardTitle>פרמטרי הערכה</CardTitle>
          <CardDescription>הציון הסופי מחושב על בסיס הפרמטרים הבאים</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradeParameters.map((parameter, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{parameter}</span>
                  <Badge variant="outline">20%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* סיכום יומי */}
      {userRole === 'coordinator' && (
        <Card>
          <CardHeader>
            <CardTitle>סיכום יומי</CardTitle>
            <CardDescription>סטטיסטיקות נוכחות וציונים של היום</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-gray-600">אחוז נוכחות</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4.2</div>
                <div className="text-sm text-gray-600">ציון ממוצע</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-sm text-gray-600">שיעורים היום</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600">תלמידים פעילים</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceSystem;
