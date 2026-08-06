import { useState, useEffect } from 'react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groceries, setGroceries] = useState<any[]>([]);

  // 1. The Bridge: Now it runs every time 'searchQuery' changes!
  useEffect(() => {
    // We attach the search string to the end of the URL
    fetch(`http://localhost:3000/api/groceries?q=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setGroceries(data); 
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [searchQuery]); // <-- We added searchQuery to the dependency array!

  // 2. IMPORTANT: We deleted the old frontend .filter() logic completely!
  // The backend does the filtering now. We just pass 'groceries' directly.
  const filteredGroceries = groceries;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">AI Grocery Price Comparison</h1>
        </header>
        
        <main className="space-y-4">
          <input 
            type="text" 
            placeholder="Search groceries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={() => console.log("Searching...")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
          
          <div id="results" className="space-y-2 mt-4">
            {filteredGroceries.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg flex justify-between items-center bg-slate-50">
                <span><strong>{item.name}</strong> at {item.store}</span>
                <span className="text-green-600 font-semibold">{item.price}</span>
                </div>
            ))}
          </div>
        </main>
        
      </div>
    </div>
  );
}