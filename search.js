import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    const response = await axios.get(`http://localhost:3000/search?query=${query}`);
    setResults(response.data);
  };

  return (
    <div>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      {results.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}

export default Search;