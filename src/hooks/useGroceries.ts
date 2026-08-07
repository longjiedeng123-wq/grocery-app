import { useState, useEffect } from 'react';

export function useGroceries() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groceries, setGroceries] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 1. The Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetch(`http://localhost:3000/api/groceries?q=${searchQuery}`)
        .then((response) => response.json())
        .then((data) => setGroceries(data))
        .catch((error) => console.error("Error fetching data:", error));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 2. The AI Search
  const handleSmartSearch = () => {
    if (!searchQuery) return;
    setIsAiLoading(true);
    fetch('http://localhost:3000/api/smart-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery })
    })
      .then((response) => response.json())
      .then((data) => {
        setGroceries(data.results || []);
        setIsAiLoading(false);
      })
      .catch((error) => {
        console.error("AI Error:", error);
        setIsAiLoading(false);
      });
  };

  // 3. Export these variables so the UI can use them!
  return {
    searchQuery,
    setSearchQuery,
    groceries,
    isAiLoading,
    handleSmartSearch
  };
}