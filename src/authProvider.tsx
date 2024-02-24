// AuthProvider.tsx
import React, { useState, useEffect, FC, useContext } from "react";
import { UserInfoDto } from "./components/user/userInfoDto";
import apiService from "./services/apiservices";
import { AuthContext } from "./authContext";
import { ToastContext } from "./toast-provider";

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserInfoDto | null>(null);  
  const { openToast } = useContext(ToastContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try{
          const response = await apiService.get<UserInfoDto>("/user");
          setUser(response.data);
        } catch(error) {
          openToast("Token verification failed:", 'error', error);
        }
      };
  
      fetchUser();
    }
  }, []);

  const login = (user: UserInfoDto) => {
    setUser(user);
  };

  const logout = (callback: () => void) => {
    setUser(null);
    localStorage.removeItem("token");
    callback();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};