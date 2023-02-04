import React, { useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retry = () => {
    setRetryCount(retryCount + 1);
    setTimeout(fetchMoviesHandler, 5000 * retryCount);
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, []);
  async function fetchMoviesHandler() {
    setLoading(true);
    setError(null);
    setRetrying(false);
    try {
      const res = await fetch("https://swapi.dev/api/films/");

      if (!res.ok) {
        throw new Error("Something went wrong ....Retrying");
      }

      const data = await res.json();
      console.log(data.results);

      const movie = data.results.map((itm) => {
        return {
          id: itm.episode_id,
          title: itm.title,
          openingText: itm.opening_crawl,
          releaseDate: itm.release_date,
        };
      });
      setMovies(movie);
    } catch (error) {
      setError(error.message);
      setRetrying(true);
    }
    setLoading(false);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!loading && movies.length > 0 && <MoviesList movies={movies} />}
        {!loading && movies.length === 0 && !error && <h3>Found no movies</h3>}
        {!loading && error && !retrying && <h3>{error}</h3>}
        {!loading && error && retrying && (
          <React.Fragment>
            <h3>{error}</h3>
            <button onClick={retry}>Retry</button>
            <button onClick={() => setRetrying(false)}>Cancel</button>
          </React.Fragment>
        )}
        {loading && <h3>Loading...</h3>}
      </section>
    </React.Fragment>
  );
}

export default App;
