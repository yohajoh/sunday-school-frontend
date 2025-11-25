import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
} from "react";
import { User } from "@/types";
import { useApp } from "./AppContext";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  LoggedOut: string | null;
  setLoggedOut: Dispatch<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: User[] = [
  {
    id: "1",
    studentId: "ADMIN001",
    email: "admin@sundayschool.org",
    role: "admin",
    firstName: "System",
    middleName: "",
    lastName: "Administrator",
    sex: "male",
    phoneNumber: "+251911223344",
    disability: false,
    dateOfBirth: "1980-01-01",
    country: "Ethiopia",
    region: "Addis Ababa",
    zone: "Central",
    woreda: "Kirkos",
    church: "St. George Cathedral",
    occupation: "System Administrator",
    marriageStatus: "married",
    parentStatus: "both",
    parentFullName: "Parent Name",
    parentEmail: "parent@example.com",
    parentPhoneNumber: "+251922334455",
    nationalId: "ADMIN123456",
    joinDate: "2020-01-01",
    status: "active",
  },
  {
    id: "2",
    studentId: "USER001",
    email: "user@church.org",
    role: "user",
    firstName: "Test",
    middleName: "",
    lastName: "User",
    sex: "female",
    phoneNumber: "+251911223355",
    disability: false,
    dateOfBirth: "1990-05-15",
    country: "Ethiopia",
    region: "Addis Ababa",
    zone: "Central",
    woreda: "Bole",
    church: "St. Mary Church",
    occupation: "Teacher",
    marriageStatus: "single",
    parentStatus: "both",
    parentFullName: "Parent User",
    parentEmail: "parentuser@example.com",
    parentPhoneNumber: "+251922334466",
    nationalId: "USER123456",
    joinDate: "2023-01-01",
    status: "active",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addUser } = useApp();
  const [LoggedOut, setLoggedOut] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user session on app start
    const storedUser = localStorage.getItem("sundayschool-user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find((u) => u.email === email);

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    // In real app, verify password hash
    if (password !== "password") {
      throw new Error("Invalid email or password");
    }

    setLoggedOut("kjklj");
    setUser(foundUser);

    setIsLoading(false);
  };

  const signup = async (userData: any) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if user already exists
    if (mockUsers.some((u) => u.email === userData.email)) {
      throw new Error("User with this email already exists");
    }

    const newUser: User = userData;

    // Add to global state
    addUser(newUser);

    // Set as current user
    setUser(newUser);

    setIsLoading(false);
  };

  const logout = () => {
    setLoggedOut(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        LoggedOut,
        setLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
