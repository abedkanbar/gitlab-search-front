import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { TextField, Button, Grid, Collapse } from "@material-ui/core";
import Groups from "../groups/groups";
import { Alert, AlertTitle } from "@material-ui/lab";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { GroupDto } from "../groups/groupeDto";

interface SearchBarProps {
  onSearch: (term: string, filename: string, groupId: number | null) => void;
  totalResults: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, totalResults }) => {
  const [term, setTerm] = useState<string>("");
  const [filenamePattern, setFilenamePattern] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<GroupDto>(null);
  const [open, setOpen] = React.useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // masquer l'alerte après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleGroupChange = (group: GroupDto | null) => {
    setSelectedGroup(group);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setIsSearching(true);
    await onSearch(term, filenamePattern, selectedGroup?.id ?? null);
    setIsSearching(false);
  };

  const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleFilenameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilenamePattern(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Search term"
            value={term}
            onChange={handleTermChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Filename pattern"
            value={filenamePattern}
            onChange={handleFilenameChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Groups onGroupChange={handleGroupChange}/>
        </Grid>
        <Grid item xs={12}>
        <Collapse in={open}>
          <Alert severity="warning" action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
            <AlertTitle>Warning</AlertTitle>
            Attention ! Seuls les 100 premiers résultats seront visibles par projet.
          </Alert>
          </Collapse>
        </Grid>
        { !isSearching && totalResults > 0 ? (<Grid item xs={12}>
          <Alert severity="info">
            {totalResults} results found
          </Alert>
        </Grid>): null}
        <Grid item xs={2}>
          <Button type="submit" variant="contained" color="primary" disabled={term.trim().length < 4 ? true : false}>
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchBar;
