
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast({
        title: "שגיאה בהתחברות",
        description: error.message === 'Invalid login credentials' 
          ? "אימייל או סיסמה שגויים" 
          : error.message,
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(signupEmail, signupPassword, fullName);
    
    if (error) {
      toast({
        title: "שגיאה בהרשמה",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "הרשמה הושלמה בהצלחה",
        description: "אנא בדוק את האימייל שלך לאישור החשבון. לאחר מכן המתן לאישור מנהל המערכת.",
      });
      // Clear form
      setSignupEmail('');
      setSignupPassword('');
      setFullName('');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">מערכת בית ספר</CardTitle>
            <CardDescription className="text-sm text-gray-600">התחבר או הירשם למערכת</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
              <TabsTrigger value="login" className="text-xs">התחברות</TabsTrigger>
              <TabsTrigger value="signup" className="text-xs">הרשמה</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="login-email" className="text-xs">אימייל</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="אימייל"
                    required
                    className="text-sm h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password" className="text-xs">סיסמה</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="סיסמה"
                    required
                    className="text-sm h-9"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-sm h-9" disabled={loading}>
                  {loading ? 'מתחבר...' : 'התחבר'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="signup-name" className="text-xs">שם מלא</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="שם מלא"
                    required
                    className="text-sm h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="text-xs">אימייל</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="אימייל"
                    required
                    className="text-sm h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password" className="text-xs">סיסמה</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="סיסמה (לפחות 6 תווים)"
                    required
                    minLength={6}
                    className="text-sm h-9"
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-start space-x-2">
                  <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-800 leading-tight">
                    <strong>שים לב:</strong> לאחר ההרשמה תצטרך לחכות לאישור מנהל המערכת כדי לגשת לפרופיל.
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-sm h-9" disabled={loading}>
                  {loading ? 'נרשם...' : 'הירשם'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
