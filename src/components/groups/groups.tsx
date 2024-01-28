import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { GroupDto } from './groupeDto';
import { debounce } from 'lodash';
import apiService from '../../services/apiservices';

const Groups = ({onGroupChange}) => {
  const [groups, setGroups] = useState<GroupDto[] | any>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupChange = (event: any, newValue: GroupDto) => {
    if (newValue && newValue.name === 'Any') {
      setSelectedGroup({ id: null, name: 'Any', path: '', fullName: 'Any' });
      onGroupChange(null);
    } else {
      setSelectedGroup(newValue);
      onGroupChange(newValue);
    }
  };

  const fetchGroupData = async (name: string) => {
    return await apiService.get<GroupDto[]>('/groups', {
      params: { name },
    });
  };

  const fetchGroups = debounce(async (name) => {
    if (name.target.value.length < 2) return;

    setLoading(true);
    try {
      const response = await fetchGroupData(name.target.value);
      setGroups([{ id: null, name: 'Any', path: 'Any', fullName: 'Any' }, ...response.data]);
    } catch (error) {
      console.error('Failed to fetch groups', error);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchGroupData("services");

        let groupToSelect = response.data.find((group) => group.id === 131);
        setSelectedGroup(groupToSelect);     
        onGroupChange(groupToSelect);
        
        setGroups([{ id: null, name: 'Any', path: 'Any', fullName: 'Any' }, ...response.data]);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Autocomplete
      id="group-search"
      options={groups}
      getOptionLabel={(option: GroupDto) => option.fullName}
      getOptionSelected={(option: GroupDto, value) => option.fullName === value.fullName}
      style={{ width: 300 }}
      freeSolo
      loading={loading}      
      onInput={(event) => fetchGroups(event)}
      value={selectedGroup}
      onChange={handleGroupChange}
      renderInput={(params) => <TextField {...params} label="Group Search" variant="standard" />}
    />
  );
};

export default Groups;