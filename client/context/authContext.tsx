import { createContext, useContext, useEffect, useState } from "react";

import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../services/authServices";
import { saveToken, getToken, deleteToken } from "../utils/secureStore";
import { User } from "../types/auth";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      setLoading(true);
      const savedToken = await getToken();

      if (!savedToken) {
        setLoading(false);
        return;
      }
      setToken(savedToken);

      const res = await getUserProfile();
      setUser(res.user);
    } catch (error) {
      console.log("Profile Error:", error);

      await deleteToken();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await loginUser({ email, password });

      await saveToken(data.token);

      setToken(data.token);
      setUser(data.user);
      Alert.alert("Success", "You have successfully logged in.");

      router.replace("/(tabs)");
    } catch (error) {
      alert("Login Failed, Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await registerUser({ name, email, password });
      await saveToken(data.token);
      setToken(data.token);
      setUser(data.user);

      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)");
    } catch (error) {
      alert("Register Failed, Please try again");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await deleteToken();

    setToken(null);
    setUser(null);
    Alert.alert("Success", "Logout Successfully!");
    router.replace("/(auth)/sign-in");
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
