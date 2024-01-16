import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { GroupDto } from './groupeDto';
import { debounce } from 'lodash';

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

  const fetchGroups = debounce(async (name) => {
    if (name.target.value.length < 2) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<GroupDto[]>(`${process.env.REACT_APP_GITLAB_BACKEND_URL}/groups`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          name: name.target.value,
        },
      });
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
        const token = localStorage.getItem("token");
        const response = await axios.get<GroupDto[]>(`${process.env.REACT_APP_GITLAB_BACKEND_URL}/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            name: "services",
          },
        });

      let groupToSelect = response.data.filter((group) => group.id === 131)[0];
      setSelectedGroup(groupToSelect);     
      
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