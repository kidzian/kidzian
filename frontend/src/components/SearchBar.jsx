import React, { useState } from 'react';

const SearchBar = () => {
  const [searchType, setSearchType] = useState('batch');
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log(`Searching for ${searchType}: ${query}`);
    // Add search logic here
  };

  return (
    <div className="mb-6">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="batch">Batch</option>
        <option value="student">Student</option>
      </select>
      <input
        type="text"
        placeholder={`Search ${searchType}s...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded ml-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;