import { createContext, useState, useContext, ReactNode } from "react";

export interface UserInfo {
  id: number;
  username: string;
  password?: string;
  profile_img: string | null;
  created_dt: string;
  updated_dt: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  token: string | null;
  login: (userInfo: UserInfo, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: UserInfo, authToken: string) => {
    setUserInfo(userData);
    setToken(authToken);
    // Optional: Save to localStorage if persistence is needed,
    // but the user didn't explicitly ask for persistence yet, just "store".
    // I will stick to memory store as per "context api" request first.
  };

  const logout = () => {
    setUserInfo(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
