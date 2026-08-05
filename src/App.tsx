import { useState } from 'react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch() {
    console.log("Searching for:", searchQuery);
  }
  return (
    <div>
      <header>
        <h1>AI Grocery Price Comparison</h1>
      </header>
      <main>
        <input type="text" 
        placeholder="Search groceries..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <div id="results">Live search preview: {searchQuery}</div>
      </main>
    </div>
 );
}