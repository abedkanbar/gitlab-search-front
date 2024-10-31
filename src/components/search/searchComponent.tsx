import React, { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import SearchBar from "./searchBar";
import SearchResult from "./searchResult";
import { Alert, Pagination } from "@mui/lab";
import apiService from "../../services/apiservices";
import { ToastContext } from "../../toast-provider";
import GitlabApiClient from "../../services/gitlabApiClient";

const RESULTS_PER_PAGE = 100;

const SearchComponent: React.FC = () => {
  const [allResults, setAllResults] = useState<any[]>(null);
  const [displayResults, setDisplayResults] = useState<any[]>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(null);
  
  const { openToast } = useContext(ToastContext);

  const handleSearch = async (
    term: string,
    filenamePattern: string,
    groupId: number
  ) => {
    setCount(null);
    setIsLoading(true);
    try {
      const response = await GitlabApiClient.search('1.0', {
        term, filenamePattern, groupId,
      });
      setSearchTerm(term);
      setAllResults(response);
      setDisplayResults(response.slice(0, RESULTS_PER_PAGE));
      setTotalResults(response.length);
      if (response.length) {
        setCount(Math.ceil(response.length / RESULTS_PER_PAGE));
        setPage(1);
      }
    } catch (error) {
      openToast(`Erreur lors de la recherche: ${error.message}`, 'error', error);
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
          {displayResults !== null && displayResults.length > 0 ? (
            <SearchResult results={displayResults} searchTerm={searchTerm} />
          ) : (
            displayResults !== null ? <Alert severity="info">No results found</Alert> : null
          )}
        </>
      )}
    </>
  );
};

export default SearchComponent;
