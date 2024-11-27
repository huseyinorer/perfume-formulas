// src/components/SearchBox.jsx
import React from "react";

const SearchBox = ({ onSearch }) => {
  const handleSearch = (e) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="mb-4">
      <input type="text" className="w-full p-2 border rounded" placeholder="Marka veya parfüm adı ara..." onChange={handleSearch} />
    </div>
  );
};

export default SearchBox;
