
export const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'admin': 
      return 'מנהל';
    case 'coordinator': 
      return 'רכז פדגוגי';
    case 'teacher': 
      return 'מורה';
    default: 
      return role;
  }
};
