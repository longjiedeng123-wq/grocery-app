import { useState } from 'react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch() {
    console.log("Searching for:", searchQuery);
  }

  const GROCERY_DB = [
  { id: 1, name: "Milk", store: "Trader Joe's", price: "$3.99" },
  { id: 2, name: "Milk", store: "Whole Foods", price: "$4.99" },
  { id: 3, name: "Eggs", store: "Ralphs", price: "$2.99" },
  { id: 4, name: "Bread", store: "Trader Joe's", price: "$2.49" }
  ];

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
        <div id="results">{GROCERY_DB.filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((item) => (
          <div key={item.id}>
            <strong>{item.name}</strong> at {item.store} - {item.price}
          </div>
        ))}
        </div>
      </main>
    </div>
 );
}