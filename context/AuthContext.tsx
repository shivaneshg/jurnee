import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  loading: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user/token on app load
    // TODO: Implement actual auth persistence check
    const checkAuthStatus = async () => {
      try {
        // Simulate checking for a stored token
        setTimeout(() => {
          // For now, we'll assume no stored user
          setUser(null);
          setLoading(false);
        }, 500);
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual login API call

      // Simulate successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const userData: User = {
        id: "user123",
        name: "Test User",
        email: email,
      };

      setUser(userData);
      // TODO: Store auth token
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual signup API call

      // Simulate successful signup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const userData: User = {
        id: "user123",
        name: name,
        email: email,
      };

      setUser(userData);
      // TODO: Store auth token
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // TODO: Clear stored token
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        user,
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
