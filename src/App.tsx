import React from "react";
import { Box, Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchComponent from "./components/search/searchComponent";
import Login from "./components/login/login";
import GitlabCallback from "./components/login/gitlabCallback";
import ProtectedRoute from "./components/routes/protected-route";
import NotFound from "./not-found";
import Home from "./home";
import Menu from "./menu";
import { ToastProvider } from "./toast-provider";
import ToastNotification from "./components/notifications/toast-notification";
import { AuthProvider } from "./authProvider";
import { ThemeProviderComponent } from "./themeContext";


const App: React.FC = () => {
    return (
    <ThemeProviderComponent>
    <BrowserRouter>
      <ToastProvider>
      <ToastNotification />
      <AuthProvider>
      <Menu />      
      <Container>        
      <Box mt={4}>
        <Routes>
        <Route path="/" element={<Home />} />        
        <Route path="/home" element={<Home />} />        
        <Route path="/login" element={<Login />} />        
        <Route path="/oauth2/callback/gitlab" element={<GitlabCallback />} /> 
        <Route path="/search" element=
          {
          <ProtectedRoute>
              <SearchComponent />
          </ProtectedRoute>
          } />
        <Route path="*" element={<NotFound />} />
        </Routes>
        </Box>
      </Container>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
    </ThemeProviderComponent>
  );
};

export default App;
