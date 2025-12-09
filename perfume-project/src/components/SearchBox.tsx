// src/components/SearchBox.tsx
import React, { useState, ChangeEvent } from 'react';

interface SearchBoxProps {
  onSearch: (value: string) => void;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className={`mb-4 ${className || ''}`}>
      <input
        type="text"
        value={searchTerm}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 
                   dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        placeholder="Parfüm veya marka ara..."
        onChange={handleSearch}
      />
      <div className="text-xs text-gray-500 mt-1">Hem marka adında hem parfüm adında arama</div>
    </div>
  );
};

export default SearchBox;
