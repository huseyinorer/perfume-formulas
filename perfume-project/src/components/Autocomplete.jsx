// components/Autocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';

const Autocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Dışarı tıklamayı dinle
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const searchPerfumes = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/perfumes/search?query=${query}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          signal
        });
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(searchPerfumes, 800);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (perfume) => {
    setQuery(`${perfume.brand} - ${perfume.name}`);
    onSelect(perfume);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setIsOpen(true)}
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        placeholder="Parfüm ara..."
      />

      {loading && (
        <div className="absolute right-3 top-2.5">
          <span className="text-gray-400 dark:text-gray-500">Aranıyor...</span>
        </div>
      )}

      {isOpen && results.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-h-60 overflow-auto">
            {results.map((perfume) => (
              <div
                key={perfume.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSelect(perfume)}
              >
                {perfume.brand} - {perfume.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;