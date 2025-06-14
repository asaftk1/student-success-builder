
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'יוסף כהן', class: 'י1', average: 4.2, attendance: 85, subjects: ['מתמטיקה', 'עברית', 'אנגלית'] },
    { id: 2, name: 'דוד לוי', class: 'י1', average: 3.8, attendance: 92, subjects: ['מתמטיקה', 'היסטוריה', 'ספרות'] },
    { id: 3, name: 'משה ישראל', class: 'י2', average: 4.5, attendance: 88, subjects: ['פיזיקה', 'כימיה', 'מתמטיקה'] },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', class: '', subjects: [] });

  const filteredStudents = students.filter(student =>
    student.name.includes(searchTerm) || student.class.includes(searchTerm)
  );

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.class) {
      setStudents([...students, { 
        id: students.length + 1, 
        ...newStudent, 
        average: 0, 
        attendance: 0,
        subjects: []
      }]);
      setNewStudent({ name: '', class: '', subjects: [] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ניהול תלמידים</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              הוסף תלמיד
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>הוסף תלמיד חדש</DialogTitle>
              <DialogDescription>הכנס פרטי התלמיד החדש</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם התלמיד</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="הכנס שם מלא"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">כיתה</Label>
                <Select value={newStudent.class} onValueChange={(value) => setNewStudent({...newStudent, class: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר כיתה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="י1">י1</SelectItem>
                    <SelectItem value="י2">י2</SelectItem>
                    <SelectItem value="יא1">יא1</SelectItem>
                    <SelectItem value="יא2">יא2</SelectItem>
                    <SelectItem value="יב1">יב1</SelectItem>
                    <SelectItem value="יב2">יב2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddStudent} className="w-full">הוסף תלמיד</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="חפש תלמיד או כיתה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם התלמיד</TableHead>
                <TableHead>כיתה</TableHead>
                <TableHead>ציון ממוצע</TableHead>
                <TableHead>אחוז נוכחות</TableHead>
                <TableHead>מקצועות</TableHead>
                <TableHead>פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.average >= 4 ? 'default' : student.average >= 3 ? 'secondary' : 'destructive'}>
                      {student.average.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={student.attendance >= 85 ? 'text-green-600' : 'text-red-600'}>
                      {student.attendance}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">סטטיסטיקות כלליות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>סה"כ תלמידים:</span>
                <span className="font-bold">{students.length}</span>
              </div>
              <div className="flex justify-between">
                <span>ציון ממוצע:</span>
                <span className="font-bold">{(students.reduce((acc, s) => acc + s.average, 0) / students.length).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>נוכחות ממוצעת:</span>
                <span className="font-bold">{Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">תלמידים מצטיינים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students
                .filter(s => s.average >= 4.0)
                .map(student => (
                  <div key={student.id} className="flex justify-between items-center">
                    <span className="text-sm">{student.name}</span>
                    <Badge className="bg-green-100 text-green-800">{student.average.toFixed(1)}</Badge>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">התפלגות כיתות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(
                students.reduce((acc, student) => {
                  acc[student.class] = (acc[student.class] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([className, count]) => (
                <div key={className} className="flex justify-between">
                  <span>כיתה {className}:</span>
                  <span className="font-bold">{count} תלמידים</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentManagement;
