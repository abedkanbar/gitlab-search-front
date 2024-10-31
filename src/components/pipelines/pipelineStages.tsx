import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Button, Tooltip, IconButton, Link } from '@mui/material';
import { Replay as ReplayIcon } from '@mui/icons-material';
import GitlabApiClient from '../../services/gitlabApiClient';
import { JobDto, BridgeDto } from '../../services/baseApiClient';

interface Stage {
  projectId: number;
  name: string;
  status: string;
  webUrl: string;
  jobs: JobDto[];
}

const PipelineStages: React.FC<{ projectId: number; pipelineId: number; }> = ({ projectId, pipelineId }) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [bridges, setBridges] = useState<BridgeDto[]>([]);
  const [isPipelineComplete, setIsPipelineComplete] = useState(false);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const isMounted = useRef(true);

  const fetchJobs = async () => {
    try {
      const response = await GitlabApiClient.listPipelineJobs(projectId, pipelineId, '1.0');
      const jobs: JobDto[] = response.reverse();

      const stageOrder = Array.from(new Set(jobs.map((job) => job.stage)));

      const stagesMap: { [key: string]: { statuses: string[], webUrl: string, jobs: JobDto[] } } = {};
      jobs.forEach((job) => {
        if (!stagesMap[job.stage!]) {
          stagesMap[job.stage!] = { statuses: [], webUrl: job.webUrl || '', jobs: [] };
        }
        stagesMap[job.stage!].statuses.push(job.status!);
        stagesMap[job.stage!].jobs.push(job);
      });

      const updatedStages = stageOrder
        .filter((stageName) => stageName !== 'e2e')
        .map((stageName) => {
          const { statuses, webUrl, jobs } = stagesMap[stageName] || { statuses: [], webUrl: '', jobs: [] };
          let stageStatus = 'not_started';

          if (statuses.includes('failed')) {
            stageStatus = 'failed';
          } else if (statuses.includes('running')) {
            stageStatus = 'running';
          } else if (statuses.every((status) => status === 'success')) {
            stageStatus = 'success';
          } else if (statuses.some((status) => status === 'pending' || status === 'created' || status === 'manual')) {
            stageStatus = 'pending';
          }

          return { projectId: projectId, name: stageName, status: stageStatus, webUrl, jobs };
        });

      if (isMounted.current) {
        setStages(updatedStages);
        const allComplete = updatedStages.every(stage => stage.status === 'success' || stage.status === 'failed');
        setIsPipelineComplete(allComplete);
        setIsPipelineRunning(updatedStages.some(stage => stage.status === 'running'));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des jobs:', error);
    }
  };

  const fetchDeployments = async () => {
    try {
      const response = await GitlabApiClient.listPipelineBridges(projectId, pipelineId, '1.0');

      if (isMounted.current) {
        setBridges(response);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des déploiements:', error);
    }
  };

  const triggerDeployment = async (bridgeId: number) => {
    try {
      if (isPipelineRunning || !isPipelineComplete || bridges.every(deployment => ['success'].indexOf(deployment.status) > -1)) {
        return;
      }
      await GitlabApiClient.playJob(projectId, bridgeId, '1.0');
  
      const updatedBridges = bridges.map((bridge) =>
        bridge.id === bridgeId ? { ...bridge, status: 'running' } : bridge
      );
      setBridges(updatedBridges);
  
      fetchDeployments();
    } catch (error) {
      console.error(`Erreur lors du déploiement:`, error);
    }
  };
  

  const retryJob = async (projectId: number, bridgeId: number) => {
    try {
      await GitlabApiClient.retryJob(projectId, bridgeId, '1.0');
      const updatedBridges = bridges.map((bridge) =>
        bridge.id === bridgeId ? { ...bridge, status: 'running' } : bridge
      );
      setBridges(updatedBridges);
    } catch (error) {
      console.error('Erreur lors du relancement du job:', error);
    }
  };

  const triggerAllDeployments = async () => {
    try {
      for (const deployment of bridges) {
        if (deployment.status === 'manual') {
          await GitlabApiClient.playJob(projectId, deployment.id, '1.0');
        }
      }
  
      // Mettre à jour les statuts de manière immuable
      const updatedBridges = bridges.map((deployment) => 
        deployment.status === 'manual' ? { ...deployment, status: 'running' } : deployment
      );
      setBridges(updatedBridges);
  
      fetchDeployments();
    } catch (error) {
      console.error(`Erreur lors du déploiement:`, error);
    }
  };
  

  useEffect(() => {
    isMounted.current = true;
    fetchJobs();
    fetchDeployments();

    const intervalId = setInterval(() => {
      if (!isPipelineComplete) {
        fetchJobs();
        fetchDeployments();
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
      isMounted.current = false;
    };
  }, [projectId, pipelineId, isPipelineComplete]);

  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="flex-start" my={2}>
        <Box display="flex" alignItems="flex-start" justifyContent="start" flex="1">
          <Typography variant="h6" mr={2}>Stages</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            {stages.map((stage) => (
              <Box key={stage.name} display="flex" flexDirection="column" alignItems="center">
                {stage.jobs.map((job) => (
                  <Tooltip
                    key={job.id}
                    title={
                      <Box style={{
                        padding: '8px',             
                        minWidth: '150px',          
                        borderRadius: '4px',        
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
                      }}                      
                      >
                        <Link href={job.webUrl} target="_blank" rel="noopener noreferrer" underline="none" sx={{ color: '#1e90ff' }}>
                            <Typography variant="body2">Log: {stage.name}</Typography>
                        </Link>
                        <IconButton
                            size="small"
                            onClick={() => retryJob(projectId, job.id)}
                            style={{ marginTop: '4px' }}
                            aria-label='Retry'
                        >
                            <ReplayIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    arrow
                  >
                    <Link href={job.webUrl} target="_blank" rel="noopener noreferrer" underline="none">
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            backgroundColor:
                              job.status === 'success'
                                ? 'green'
                                : job.status === 'failed'
                                ? 'red'
                                : job.status === 'running'
                                ? '#1e90ff'
                                : 'grey',
                            transition: 'background-color 0.3s ease',
                            margin: '5px',
                            cursor: 'pointer',
                          }}
                        />
                      </Link>
                  </Tooltip>
                ))}              
                </Box>
            ))}
          </Box>
        </Box>

        <Box display="flex" alignItems="flex-start" justifyContent="start" flex="1">
          <Typography variant="h6" mr={2}>Déploiements</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
                onClick={triggerAllDeployments}
                disabled={isPipelineRunning || !isPipelineComplete || bridges.every(deployment => ['success'].indexOf(deployment.status) > -1)}
                variant="contained"
                color="primary"
                style={{ margin: '0 auto', padding: '10px 20px' }}
            >
                Run All
            </Button>
            {bridges.map((bridge) => (                
              <Box key={bridge.id} display="flex" flexDirection="column" alignItems="center">    
              <Tooltip
                    key={bridge.id}
                    title={
                      <Box style={{
                        padding: '8px',             
                        minWidth: '150px',          
                        borderRadius: '4px',        
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
                      }}                      
                      >
                                               
                        <Link href={bridge.status !== 'manual' ? bridge.webUrl : '#'} target="_blank" rel="noopener noreferrer" underline="none" sx={{ color: '#1e90ff' }}>
                            <Typography variant="body2">Log: {bridge.name}</Typography>
                        </Link>
                        <IconButton
                            size="small"
                            onClick={() => retryJob(projectId, bridge.id)}
                            style={{ marginTop: '4px' }}
                            aria-label='Retry'
                        >
                            <ReplayIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    arrow
                  >
                                        
                 <Button
                    onClick={() => triggerDeployment(bridge.id)}
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        backgroundColor:
                        bridge.status === 'success'
                            ? 'green'
                            : bridge.status === 'failed'
                            ? 'red'
                            : bridge.status === 'running'
                            ? '#1e90ff'
                            : 'grey',
                        minWidth: 0,
                        padding: 0,
                        transition: 'background-color 0.3s ease',
                        marginRight: '8px',                        
                    }}
                    />
                    
                  </Tooltip>                      
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PipelineStages;
