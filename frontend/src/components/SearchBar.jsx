import React, { useState } from 'react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/students?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => console.log(data)); // Display search results
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by name, course, or batch"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;