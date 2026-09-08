import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getUserProfile, loginUser } from "../services/authServices";
import { saveToken, getToken, deleteToken } from "../utils/secureStore";
import { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await getUserProfile();
      console.log(res)
      console.log(res.user)
      setUser(res.user);
    } catch (error) {

    } finally {
      setLoading(false);
    }

  };

  const signIn = async (
    email: string,
    password: string
  ) => {
    const data = await loginUser({ email, password });

    await saveToken(data.token);

    setToken(data.token);
    setUser(data.user);
  };

  const signOut = async () => {
    await deleteToken();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);