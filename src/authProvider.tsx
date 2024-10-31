import React, { useState, useEffect, FC, useContext } from "react";
import { AuthContext } from "./authContext";
import { ToastContext } from "./toast-provider";
import { LocalStorageConstants } from "./local-storage-constants";
import GitlabApiClient from "./services/gitlabApiClient";
import { UserInfoDto } from "./services/baseApiClient";

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserInfoDto | null>(null);  
  const { openToast } = useContext(ToastContext);

  useEffect(() => {
    const token = LocalStorageConstants.getString(LocalStorageConstants.Token);
    if (token) {
      const fetchUser = async () => {
        try{
          const response = await GitlabApiClient.getUserInfo('1.0');
          setUser(response);
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
    LocalStorageConstants.removeItem(LocalStorageConstants.Token);
    callback();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};