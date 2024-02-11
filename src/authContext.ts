import { createContext } from "react";
import { UserInfoDto } from "./components/user/userInfoDto";

export const AuthContext = createContext({
  user: null as UserInfoDto | null, 
  login: (user: UserInfoDto) => {},
  logout: (callback: () => void) => {},
});