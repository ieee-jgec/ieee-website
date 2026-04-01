"use client";

import {
  useGetUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} from "@/app/admin/features/user/userApi";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data, isLoading, isError } = useGetUserQuery();
  const user = data?.data;

  useEffect(() => {
    if (isError) {
      router.push("/admin/auth/login");
    }
  }, [isError, router]);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  // login
  const login = async (email: string, password: string) => {
    if (!email || !password) return;
    try {
      await loginUser({ body: { email, password } })
        .unwrap()
        .then(() => {
          window.location.href = `${window.location.origin}/admin/access-control`;
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // logout
  const logout = async () => {
    try {
      await logoutUser()
        .unwrap()
        .then(() => {
          window.location.href = `${window.location.origin}/admin/auth/login`;
        });
    } catch (error) {
      toast.error("Failed to login");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoggingIn,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { isAuthenticated, user, login, logout, isLoggingIn, isLoggingOut } =
    useContext(AuthContext)!;

  return { isAuthenticated, user, login, logout, isLoggingIn, isLoggingOut };
};

export default AuthContext;
