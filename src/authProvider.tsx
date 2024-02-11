// AuthProvider.tsx
import React, { useState, useEffect, FC } from "react";
import { UserInfoDto } from "./components/user/userInfoDto";
import apiService from "./services/apiservices";
import { AuthContext } from "./authContext";

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserInfoDto | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        const response = await apiService.get<UserInfoDto>("/user");
        setUser(response.data);
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