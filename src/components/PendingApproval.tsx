
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PendingApproval = () => {
  const { profile, signOut } = useAuth();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'מנהל';
      case 'coordinator': return 'רכז פדגוגי';
      case 'teacher': return 'מורה';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl mx-2">
        <CardHeader className="text-center space-y-2 sm:space-y-4 p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">ממתין לאישור</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              החשבון שלך נרשם בהצלחה אך עדיין ממתין לאישור מנהל המערכת
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">פרטי החשבון שלך:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 break-words">{profile?.full_name}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 break-all">{profile?.email}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="w-3 h-3 sm:w-4 sm:h-4 text-center text-gray-500 text-xs flex-shrink-0">👔</span>
                <span className="text-xs sm:text-sm text-gray-700">{getRoleLabel(profile?.role || '')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-yellow-800 mb-1 sm:mb-2 text-sm">מה קורה עכשיו?</h4>
            <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
              <li>• מנהל המערכת יקבל הודעה על בקשת ההצטרפות שלך</li>
              <li>• לאחר בדיקת הפרטים, החשבון שלך יאושר</li>
              <li>• תקבל הודעה כאשר תוכל להיכנס למערכת</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              צריך לצאת מהחשבון?
            </p>
            <Button variant="outline" onClick={signOut} className="w-full text-sm">
              התנתק
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
