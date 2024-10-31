import { createContext } from "react";
import { UserInfoDto } from "./services/baseApiClient";

export const AuthContext = createContext({
  user: null as UserInfoDto | null,
  login: (user: UserInfoDto) => {},
  logout: (callback: () => void) => {},
});
