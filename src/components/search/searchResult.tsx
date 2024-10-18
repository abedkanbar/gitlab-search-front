import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Link,
  Box,  
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { makeStyles } from "@mui/material";

function useStyles()
{
  return makeStyles({
  resultCard: {
    margin: "1rem 0",
  },
  codeLine: {
    fontFamily: "Monaco, monospace",
    fontSize: "0.875rem",
    color: "#24292e",
    backgroundColor: "#f6f8fa",
  },
  highlightedLine: {
    backgroundColor: "#fffbdd",
  },
  gridContainer: {
    width: "100%",
    marginTop: 8,
  },
});
}
interface Result {
  projectName: string;
  projectPath: string;
  branche: string;
  fileName: string;
  startLine: number;
  data: string;
}

interface SearchResultProps {
  results: Result[];
  searchTerm: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ results, searchTerm }) => {
  const gitlabBaseUrl = process.env.REACT_APP_GITLAB_BASE_URL;

  const classes = useStyles();

  const groupedResults = results.reduce(
    (acc: { [key: string]: Result[] }, result: Result) => {
      acc[result.projectName] = acc[result.projectName] || [];
      acc[result.projectName].push(result);
      return acc;
    },
    {}
  );

  return (
    <div>
      <br />
      {Object.entries(groupedResults).map(
        ([projectName, projectResults], index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">{projectName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} className={classes['gridContainer']}>
                {projectResults.map((result, resultIndex) => (
                  <Grid item xs={12} sm={12} md={12} lg={12} key={resultIndex}>
                    <Card className={classes['resultCard']}>
                      <CardContent>
                        <Typography variant="h6">
                          <Link
                            href={`${gitlabBaseUrl}/${result.projectPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {result.projectName}
                          </Link>
                        </Typography>
                        <Typography variant="body1">
                          Fichier :
                          <Link
                            href={`${gitlabBaseUrl}/${result.projectPath}/-/blob/${result.branche}/${result.fileName}#L${result.startLine}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {result.fileName}
                          </Link>
                        </Typography>
                        <Typography variant="body1">
                          Ligne : {result.startLine}
                        </Typography>
                        <Typography component="pre">
                          {result.data.split("\n").map((line, lineIndex) => (
                            <Box
                              key={lineIndex}
                              className={`${classes['codeLine']} ${
                                line.includes(searchTerm)
                                  ? classes['highlightedLine']
                                  : ""
                              }`}
                            >
                              <Typography component="pre">{line}</Typography>
                            </Box>
                          ))}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )
      )}
    </div>
  );
};

export default SearchResult;
