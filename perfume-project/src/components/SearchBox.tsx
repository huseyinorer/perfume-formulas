// src/components/SearchBox.jsx
import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search için useCallback kullanıyoruz
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="mb-4">
      <input 
        type="text" 
        value={searchTerm}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 
                   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400" 
        placeholder="Parfüm veya marka ara..." 
        onChange={handleSearch}
      />
      <div className="text-xs text-gray-500 mt-1">
        Hem marka adında hem parfüm adında arama yapar
      </div>
    </div>
  );
};

export default SearchBox;