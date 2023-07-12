import { useEffect, useState } from 'react';
import SearchResult from './components/SearchResult';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  function handleFormSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:4000/search/${search}`)
      .then(response => response.json())
      .then(data => setResults(data));
  }

  function handleChange(e) {
    // console.log(e.target.value);
    setSearch(e.target.value);
  }

  useEffect(() => {
    console.log(results);
  }, [results])

  return (
    <div className="App">
      <header className="style2">
        <h2>
          Search Engine
        </h2>
      </header>
      
      <form onSubmit={handleFormSubmit}>
        <input type="text" onChange={handleChange}/>
        <button type="submit">Search</button>
      </form>

      <div className="results-container">
        {results.map( doc => <SearchResult key={doc._id} document={doc} />)}
      </div>
    </div>
  );
}

export default App;
