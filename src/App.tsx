import { useGroceries } from './hooks/useGroceries';

export default function App() {
  // 2. Grab all the logic and variables from our hook in one line of code
  const { 
    searchQuery, 
    setSearchQuery, 
    groceries, 
    isAiLoading, 
    handleSmartSearch 
  } = useGroceries();

  const filteredGroceries = groceries;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">AI Grocery Price Comparison</h1>
        </header>
        
        <main className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search groceries or try 'high protein breakfast'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSmartSearch}
              disabled={isAiLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition flex items-center gap-2"
            >
              {isAiLoading ? '🧠 Thinking...' : '✨ Ask AI'}
            </button>
          </div>
    
          
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