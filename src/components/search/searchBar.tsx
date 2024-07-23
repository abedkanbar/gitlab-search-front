import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import Groups from "../groups/groups";
import CloseIcon from '@mui/icons-material/Close';
import { GroupDto } from "../groups/groupeDto";
import { Alert, AlertTitle, Button, Collapse, Grid, TextField, IconButton } from '@mui/material';

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
  const [groupError, setGroupError] = useState(false);
  const [isTermTextEmpty, setIsTermTextEmpty] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleGroupChange = (group: GroupDto | null) => {
    setSelectedGroup(group);
  };

  const IsValid = () => {
    let valid = true;
    if(term.trim() === "") {
      setIsTermTextEmpty(true);
      valid = false;
    }
    return valid;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Vérifiez si les champs sont vides
    const isTermEmpty = term.trim() === "";
    const isGroupEmpty = selectedGroup === null;

    // Définissez les erreurs
    setIsTermTextEmpty(isTermEmpty);
    setGroupError(isGroupEmpty);

    // Si l'un des champs est vide, retournez et n'exécutez pas la recherche
    if (isTermEmpty || isGroupEmpty) {
      return;
    }

    setOpen(false);
    setIsSearching(true);
    await onSearch(term, filenamePattern, selectedGroup?.id ?? null);
    setIsSearching(false);
  };

  const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setIsTermTextEmpty(false);
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
            error={isTermTextEmpty}
            label="Search term"
            helperText={isTermTextEmpty ? "Search term is required" : ""}
            value={term}
            onChange={handleTermChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Filename pattern: *.cs, *.md, readme.md, ..."
            value={filenamePattern}
            onChange={handleFilenameChange}            
          />
        </Grid>
        <Grid item xs={4}>
          <Groups onGroupChange={handleGroupChange} onGroupSelect={() => setGroupError(false)} error={groupError} />
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
          <Alert>
            {totalResults} results found
          </Alert>
        </Grid>): null}
        <Grid item xs={2}>
          <Button type="submit" variant="contained" color="primary" >
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchBar;
