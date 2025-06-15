
export const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'admin': 
      return 'מנהל';
    case 'coordinator': 
      return 'רכז פדגוגי';
    case 'teacher': 
      return 'מורה';
    case 'instructor':
      return 'מדריך';
    case 'group_coordinator':
      return 'רכז קבוצה';
    default: 
      return role;
  }
};

export const getRolePermissions = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        canManageUsers: true,
        canManageStudents: true,
        canManageSchedule: true,
        canManageGrading: true,
        canViewAttendance: true,
        canManageExams: true,
        canViewAllGroups: true
      };
    case 'coordinator':
      return {
        canManageUsers: false,
        canManageStudents: true,
        canManageSchedule: true,
        canManageGrading: true,
        canViewAttendance: true,
        canManageExams: true,
        canViewAllGroups: true
      };
    case 'group_coordinator':
      return {
        canManageUsers: false,
        canManageStudents: true,
        canManageSchedule: true,
        canManageGrading: true,
        canViewAttendance: true,
        canManageExams: true,
        canViewAllGroups: false // רק הקבוצה שלו
      };
    case 'teacher':
      return {
        canManageUsers: false,
        canManageStudents: false,
        canManageSchedule: false,
        canManageGrading: true,
        canViewAttendance: true,
        canManageExams: false,
        canViewAllGroups: true
      };
    case 'instructor':
      return {
        canManageUsers: false,
        canManageStudents: false,
        canManageSchedule: false,
        canManageGrading: false,
        canViewAttendance: true,
        canManageExams: false,
        canViewAllGroups: false // רק הקבוצה שלו
      };
    default:
      return {
        canManageUsers: false,
        canManageStudents: false,
        canManageSchedule: false,
        canManageGrading: false,
        canViewAttendance: false,
        canManageExams: false,
        canViewAllGroups: false
      };
  }
};
