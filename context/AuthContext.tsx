import { auth } from "@/utils/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  login: (email: string, password: string) => Promise<User | null>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<User | null>;
  logout: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const unsubscribe_auth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        console.log("Auth state changed: User is logged in");
        setUser(firebaseUser);
      } else {
        console.log("Auth state changed: User is not logged in");
        logout();
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe_auth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in successfully,");
      return userCredential.user;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Login error:", errorCode, errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      return user;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Login error:", errorCode, errorMessage);
      return null;
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log("User signed out successfully");
      })
      .catch((error) => {
        setUser(null);
        console.error("Sign out error:", error);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
