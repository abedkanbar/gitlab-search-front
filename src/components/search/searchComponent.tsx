import React, { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import SearchBar from "./searchBar";
import SearchResult from "./searchResult";
import { Alert, Pagination } from "@material-ui/lab";

const RESULTS_PER_PAGE = 100;

const SearchComponent: React.FC = () => {
  const [allResults, setAllResults] = useState<any[]>([]);
  const [displayResults, setDisplayResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(null);
  const GITLAB_BACKEND_URL = process.env.REACT_APP_GITLAB_BACKEND_URL;

  const handleSearch = async (
    term: string,
    filenamePattern: string,
    groupId: number
  ) => {
    const token = localStorage.getItem("token");
    setCount(null);
    setIsLoading(true);
    try {
      let url = `${GITLAB_BACKEND_URL}/search?term=${term}&filenamePattern=${filenamePattern}`;

      if (groupId) {
        url += `&groupId=${groupId}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchTerm(term);
      setAllResults(response.data);
      setDisplayResults(response.data.slice(0, RESULTS_PER_PAGE));
      setTotalResults(response.data.length);
      if (response.data.length) {
        setCount(Math.ceil(response.data.length / RESULTS_PER_PAGE));
        setPage(1);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    }
    setIsLoading(false);
  };

  const handlePageChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPage(value);
    const start = (value - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    setDisplayResults(allResults.slice(start, end));
    setIsLoading(false);
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} totalResults={totalResults} />
      <br />
      <Pagination
        hidden={count === null}
        count={count}
        page={page}
        onChange={handlePageChange}
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {displayResults.length > 0 ? (
            <SearchResult results={displayResults} searchTerm={searchTerm} />
          ) : (
            <Alert severity="info">No results found</Alert>
          )}
        </>
      )}
    </>
  );
};

export default SearchComponent;
