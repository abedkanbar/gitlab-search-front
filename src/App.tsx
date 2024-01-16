import React from "react";
import { Container, Typography } from "@material-ui/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchComponent from "./components/search/searchComponent";
import Login from "./components/login/login";
import GitlabCallback from "./components/login/gitlabCallback";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Container>
        <Typography variant="h3">Recherche GitLab</Typography>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback/gitlab" element={<GitlabCallback />} />
          <Route path="/search" element={<SearchComponent />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
