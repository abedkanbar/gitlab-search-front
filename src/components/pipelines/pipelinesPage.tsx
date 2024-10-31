import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Button, Paper, Typography, Box, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import GitlabApiClient from '../../services/gitlabApiClient';
import { ProjectDto, ProjectBranchDto } from '../../services/baseApiClient';
import PipelineStages from './pipelineStages';

const PipelinesPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<ProjectDto[]>([]);
  const [branches, setBranches] = useState<{ [key: number]: ProjectBranchDto[] }>({});
  const [selectedBranches, setSelectedBranches] = useState<{ [key: number]: ProjectBranchDto | null }>({});
  const [activePipelines, setActivePipelines] = useState<{ [key: number]: number | null }>({});
  const [searchValue, setSearchValue] = useState('');

  // Fetch branches function
  const fetchBranches = async (projectId: number) => {
    try {
      const response = await GitlabApiClient.getLastProjectBranches(projectId, '1.0');
      setBranches((prev) => ({ ...prev, [projectId]: response }));
    } catch (error) {
      console.error('Erreur lors de la récupération des branches:', error);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const projectsParam = url.searchParams.getAll('projects');
    if (projectsParam.length > 0) {
      const projectIds = projectsParam.map((id) => parseInt(id));
      const fetchProjectsByIds = async (ids: number[]) => {
        try {
          const projectsData = await GitlabApiClient.getProjectsByIds('1.0', ids);
          setSelectedProjects(projectsData);
          // Récupérer les branches pour chaque projet
          projectsData.forEach((project) => {
            fetchBranches(project.id);
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des projets par IDs:', error);
        }
      };
      fetchProjectsByIds(projectIds);
    }
  }, []);
  

  useEffect(() => {
    const projectIds = selectedProjects.map((project) => project.id);
    const url = new URL(window.location.href);
    url.searchParams.delete('projects');
    projectIds.forEach((id) => {
      url.searchParams.append('projects', id.toString());
    });
    window.history.replaceState({}, '', url.toString());
  }, [selectedProjects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await GitlabApiClient.getAllProjects('1.0', searchValue);
        setProjects(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    };

    if (searchValue.length >= 3) {
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [searchValue]);

  const handleProjectSelect = (event: any, value: ProjectDto | null) => {
    if (value && !selectedProjects.some((proj) => proj.id === value.id)) {
      setSelectedProjects((prev) => [...prev, value]);
      fetchBranches(value.id);
    }
  };

  const handleBranchSelect = (projectId: number, branch: ProjectBranchDto | null) => {
    setSelectedBranches((prev) => ({ ...prev, [projectId]: branch }));
  };

  const getLastPipeline = async (projectId: number) => {
    try {
      const response = await GitlabApiClient.getLastPipeline(projectId, '1.0');
      setActivePipelines((prev) => ({ ...prev, [projectId]: response.id }));
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier pipeline:', error);
      alert('Impossible de récupérer le dernier pipeline.');
    }
  };

  const triggerPipeline = async (projectId: number) => {
    const branch = selectedBranches[projectId];
    if (!branch) {
      alert('Veuillez sélectionner une branche.');
      return;
    }

    try {
      const response = await GitlabApiClient.createPipeline(projectId, '1.0', { ref: branch.name, projectId: projectId });
      setActivePipelines((prev) => ({ ...prev, [projectId]: response.id }));
    } catch (error) {
      console.error('Erreur lors du déclenchement du pipeline:', error);
    }
  };

  const handleDeleteProject = (projectId: number) => {
    setSelectedProjects((prev) => prev.filter((project) => project.id !== projectId));
    // Also remove associated branches and active pipelines
    setBranches((prev) => {
      const updatedBranches = { ...prev };
      delete updatedBranches[projectId];
      return updatedBranches;
    });
    setActivePipelines((prev) => {
      const updatedPipelines = { ...prev };
      delete updatedPipelines[projectId];
      return updatedPipelines;
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Pipelines
      </Typography>
      <Autocomplete
        options={projects.filter(
          (project) => !selectedProjects.some((selected) => selected.id === project.id)
        )}
        getOptionLabel={(option ) => option.nameWithNamespace}
        onChange={handleProjectSelect}
        inputValue={searchValue}
        onInputChange={(event, newInputValue) => setSearchValue(newInputValue)}
        renderInput={(params) => 
          <TextField 
            {...params}
            label="Rechercher un projet"
            variant="outlined" 
            onKeyDown={(event) => {
              // Autoriser les touches de navigation
              if (['Home', 'End'].includes(event.key) || 
                  (event.ctrlKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))) {
                event.stopPropagation();
              }
            }}
            />
          }
      />
      <Box mt={4}>
        {selectedProjects.map((project) => (
          <Paper key={project.id} style={{ padding: '10px', marginBottom: '10px', position: 'relative' }}>
            <Typography style={{ padding: '5px', marginBottom: '5px', position: 'relative' }} variant="h6">
              {project.nameWithNamespace}
            </Typography>
            <IconButton
              onClick={() => handleDeleteProject(project.id)}
              style={{ position: 'absolute', top: 10, right: 10 }}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
            <Autocomplete
              options={branches[project.id] || []}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => handleBranchSelect(project.id, value)}
              renderInput={(params) => <TextField {...params} label="Sélectionner une branche" variant="outlined" />}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => triggerPipeline(project.id)}
              style={{ marginTop: '10px' }}
            >
              Create Pipeline
            </Button>
            <Button
              onClick={() => getLastPipeline(project.id)}
              variant="outlined"
              color="warning"
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Get Last Pipeline
            </Button>
            {activePipelines[project.id] && (
              <Box mt={2}>
                <PipelineStages projectId={project.id} pipelineId={activePipelines[project.id] as number} />
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </div>
  );
};

export default PipelinesPage;
