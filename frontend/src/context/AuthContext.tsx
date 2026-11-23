import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole, userOverride?: User) => void;
  availableDemoUsers: User[];
}

const DEMO_USERS: User[] = [
  {
    id: "user-stu-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@campus.edu",
    role: "student",
    studentId: "STU-2026-1049",
    department: "Computer Science",
    hostelOrBuilding: "Aryabhatta Hall, Room 302"
  },
  {
    id: "user-stu-2",
    name: "Priya Patel",
    email: "priya.patel@campus.edu",
    role: "student",
    studentId: "STU-2026-1182",
    department: "Electronics & Communication",
    hostelOrBuilding: "Kalpana Chawla Hall, Room 114"
  },
  {
    id: "user-admin-1",
    name: "Dr. Vikram Malhotra",
    email: "facilities.director@campus.edu",
    role: "admin",
    department: "Directorate of Campus Facilities",
    title: "Campus Facilities Director"
  },
  {
    id: "user-staff-1",
    name: "Rajesh Kumar",
    email: "rajesh.av@campus.edu",
    role: "staff",
    department: "AV Maintenance",
    title: "Lead AV Specialist"
  },
  {
    id: "user-staff-2",
    name: "Suresh Verma",
    email: "suresh.elec@campus.edu",
    role: "staff",
    department: "Electrical Maintenance",
    title: "Senior Campus Electrician"
  },
  {
    id: "user-staff-3",
    name: "Anil Joshi",
    email: "anil.plumbing@campus.edu",
    role: "staff",
    department: "Plumbing & Water Systems",
    title: "Chief Plumber"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('cf_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_USERS[0];
  });

  const switchRole = (role: UserRole, userOverride?: User) => {
    let nextUser: User;
    if (userOverride) {
      nextUser = userOverride;
    } else {
      nextUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    }
    setCurrentUser(nextUser);
    localStorage.setItem('cf_user', JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchRole,
        availableDemoUsers: DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
