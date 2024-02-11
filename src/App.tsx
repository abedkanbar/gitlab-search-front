import React from "react";
import { Box, Container } from "@material-ui/core";
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

const App: React.FC = () => {
 
  return (
    <AuthProvider>
    <BrowserRouter>
      <Menu />
      <ToastProvider>
      <ToastNotification />
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
      </ToastProvider>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
