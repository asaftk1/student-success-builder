
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, TrendingUp, Award, FileText, Plus } from 'lucide-react';

interface GradingSystemProps {
  userRole: string;
}

const GradingSystem = ({ userRole }: GradingSystemProps) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
  const [students] = useState([
    { 
      id: 1, 
      name: 'יוסף כהן', 
      class: 'י1',
      dailyAvg: 4.2, 
      monthlyAvg: 4.0, 
      yearlyAvg: 3.8,
      subjects: {
        'מתמטיקה': { daily: [4, 5, 3, 4], monthly: 4.0, yearly: 3.9 },
        'עברית': { daily: [3, 4, 4, 5], monthly: 4.0, yearly: 4.1 },
        'אנגלית': { daily: [5, 4, 4, 3], monthly: 4.0, yearly: 4.0 },
      }
    },
    { 
      id: 2, 
      name: 'דוד לוי', 
      class: 'י1',
      dailyAvg: 3.8, 
      monthlyAvg: 3.9, 
      yearlyAvg: 3.7,
      subjects: {
        'מתמטיקה': { daily: [3, 4, 3, 4], monthly: 3.5, yearly: 3.6 },
        'עברית': { daily: [4, 3, 4, 4], monthly: 3.8, yearly: 3.7 },
        'אנגלית': { daily: [4, 4, 3, 4], monthly: 3.8, yearly: 3.8 },
      }
    },
  ]);

  const [newGrade, setNewGrade] = useState({
    studentId: '',
    subject: '',
    type: 'test', // test, assignment, daily
    grade: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const addGrade = () => {
    console.log('הוספת ציון חדש:', newGrade);
    // כאן תהיה הלוגיקה להוספת ציון חדש
    setNewGrade({
      studentId: '',
      subject: '',
      type: 'test',
      grade: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'bg-green-100 text-green-800';
    if (grade >= 3.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily': return 'יומי';
      case 'monthly': return 'חודשי';
      case 'yearly': return 'שנתי';
      default: return 'נוכחי';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">מערכת ציונים</h2>
        {userRole === 'teacher' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                הוסף ציון
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>הוסף ציון חדש</DialogTitle>
                <DialogDescription>הוסף ציון מבחן או עבודה לתלמיד</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>תלמיד</Label>
                  <Select value={newGrade.studentId} onValueChange={(value) => setNewGrade({...newGrade, studentId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר תלמיד" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>מקצוע</Label>
                  <Select value={newGrade.subject} onValueChange={(value) => setNewGrade({...newGrade, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר מקצוע" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="מתמטיקה">מתמטיקה</SelectItem>
                      <SelectItem value="עברית">עברית</SelectItem>
                      <SelectItem value="אנגלית">אנגלית</SelectItem>
                      <SelectItem value="היסטוריה">היסטוריה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>סוג ציון</Label>
                  <Select value={newGrade.type} onValueChange={(value) => setNewGrade({...newGrade, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">מבחן</SelectItem>
                      <SelectItem value="assignment">עבודה</SelectItem>
                      <SelectItem value="daily">ציון יומי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ציון (1-100)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={newGrade.grade}
                    onChange={(e) => setNewGrade({...newGrade, grade: e.target.value})}
                    placeholder="הכנס ציון"
                  />
                </div>
                <div className="space-y-2">
                  <Label>תיאור</Label>
                  <Input
                    value={newGrade.description}
                    onChange={(e) => setNewGrade({...newGrade, description: e.target.value})}
                    placeholder="תיאור המבחן/עבודה"
                  />
                </div>
                <div className="space-y-2">
                  <Label>תאריך</Label>
                  <Input
                    type="date"
                    value={newGrade.date}
                    onChange={(e) => setNewGrade({...newGrade, date: e.target.value})}
                  />
                </div>
                <Button onClick={addGrade} className="w-full">הוסף ציון</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* בחירת פרמטרים */}
      <Card>
        <CardHeader>
          <CardTitle>בחירת תלמיד ותקופה</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <div className="space-y-2">
            <Label>תלמיד</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="בחר תלמיד" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל התלמידים</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>תקופה</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">יומי</SelectItem>
                <SelectItem value="monthly">חודשי</SelectItem>
                <SelectItem value="yearly">שנתי</SelectItem>
                <SelectItem value="current">נוכחי</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* סיכום ציונים */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ממוצע יומי</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.1</div>
            <p className="text-xs text-muted-foreground">+0.2 מאתמול</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ממוצע חודשי</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.9</div>
            <p className="text-xs text-muted-foreground">+0.1 מחודש שעבר</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ממוצע שנתי</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8</div>
            <p className="text-xs text-muted-foreground">יציב</p>
          </CardContent>
        </Card>
      </div>

      {/* טבלת ציונים */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>סיכום ציונים - {getPeriodLabel(selectedPeriod)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תלמיד</TableHead>
                <TableHead>כיתה</TableHead>
                <TableHead>ממוצע יומי</TableHead>
                <TableHead>ממוצע חודשי</TableHead>
                <TableHead>ממוצע שנתי</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(student.dailyAvg)}>
                      {student.dailyAvg.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(student.monthlyAvg)}>
                      {student.monthlyAvg.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(student.yearlyAvg)}>
                      {student.yearlyAvg.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.yearlyAvg >= 4 ? (
                      <Badge className="bg-green-100 text-green-800">מצטיין</Badge>
                    ) : student.yearlyAvg >= 3 ? (
                      <Badge className="bg-yellow-100 text-yellow-800">ממוצע</Badge>
                    ) : (
                      <Badge variant="destructive">זקוק לשיפור</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      פרטים מלאים
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* פירוט לפי מקצועות */}
      {selectedStudent && selectedStudent !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>פירוט ציונים לפי מקצועות</CardTitle>
            <CardDescription>
              {students.find(s => s.id.toString() === selectedStudent)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(students.find(s => s.id.toString() === selectedStudent)?.subjects || {}).map(([subject, grades]) => (
                <div key={subject} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{subject}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">ציונים יומיים:</span>
                      <div className="flex space-x-1 mt-1">
                        {grades.daily.map((grade, index) => (
                          <Badge key={index} variant="outline">{grade}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ממוצע חודשי:</span>
                      <div className="mt-1">
                        <Badge className={getGradeColor(grades.monthly)}>
                          {grades.monthly.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">ממוצע שנתי:</span>
                      <div className="mt-1">
                        <Badge className={getGradeColor(grades.yearly)}>
                          {grades.yearly.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GradingSystem;
