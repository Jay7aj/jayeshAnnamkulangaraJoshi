// issue-tracker-frontend/src/context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState{
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  function setAuth(user: User, token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setState({
      user,
      token,
      loading: false,
    });
  }

  function logout() {
    localStorage.clear();
    setState({
      user: null,
      token: null,
      loading: false,
    });
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken){
      setState({
        user: JSON.parse(storedUser),
        token: storedToken,
        loading: false,
      });
    }else{
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
