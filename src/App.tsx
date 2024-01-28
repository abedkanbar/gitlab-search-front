import React, {  } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchComponent from "./components/search/searchComponent";
import Login from "./components/login/login";
import GitlabCallback from "./components/login/gitlabCallback";
import ProtectedRoute from "./components/routes/protected-route";
import NotFound from "./not-found";

const App: React.FC = () => {
  localStorage.setItem('redirectUrl', window.location.pathname);
  return (
    <BrowserRouter>
      <Container>        
      <Box mt={4}>
        <Routes>
        <Route path="/login" element={<Login />} />        
        <Route path="/oauth2/callback/gitlab" element={<GitlabCallback />} /> 
        <Route path="/search" element=
          {
          <ProtectedRoute>
              <SearchComponent />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
};

export default App;
