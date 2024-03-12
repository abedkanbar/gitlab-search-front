import React, { useState, useEffect, useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { GroupDto } from './groupeDto';
import { debounce } from 'lodash';
import apiService from '../../services/apiservices';
import { ToastContext } from '../../toast-provider';
import { LocalStorageConstants } from '../../local-storage-constants';

const AnyGroup = { id: null, name: 'Any', path: 'Any', fullName: 'Any' };

const Groups = ({onGroupChange, onGroupSelect, error}) => {
  const [groups, setGroups] = useState<GroupDto[] | any>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { openToast } = useContext(ToastContext);

  const handleGroupChange = (event: any, newValue: GroupDto) => {
    if (newValue && newValue.name === 'Any') {
      setSelectedGroup(AnyGroup);
      onGroupChange(AnyGroup);     
      onGroupSelect();      
      LocalStorageConstants.setItem(LocalStorageConstants.SelectedGroup, AnyGroup);
    } else {
      setSelectedGroup(newValue);
      onGroupChange(newValue);
      LocalStorageConstants.setItem(LocalStorageConstants.SelectedGroup, newValue);
      onGroupSelect();
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
      setGroups([AnyGroup, ...response.data]);
    } catch (error) {
      openToast("error in fetching groups", 'error');
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    async function fetchData() {
      try {
        let groupDto = LocalStorageConstants.getItem<GroupDto>(LocalStorageConstants.SelectedGroup);
        if(groupDto !== null && groupDto.id !== null ) {
          let response = await fetchGroupData(groupDto.name);
          response.data = response.data.filter((group) => group.id === groupDto.id);

          var groupToSelect = response.data[0];
          setSelectedGroup(groupToSelect);     
          onGroupChange(groupToSelect);
          
          setGroups([AnyGroup, ...response.data]);
        } else {
          setGroups([AnyGroup]);
          setSelectedGroup(AnyGroup);
          onGroupChange(AnyGroup);
        }

      } catch (error) {
        openToast("error in fetching groups", 'error');
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
      renderInput={(params) => 
        <TextField 
          {...params}
          error={error}
          helperText={error ? "Group is required" : ""}
          label="Project Group (type the first characters)"
          variant="standard" />}
    />
  );
};

export default Groups;