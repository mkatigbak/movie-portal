import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTopRatedMovies, searchMovies, fetchGenres, fetchMoviesByGenre } from '../api/tmdbApi';
import styles from '../styles/HomePage.module.css';

const MOVIES_PER_ROW = 6;
const MOVIES_PER_PAGE = MOVIES_PER_ROW * 3;

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let data;
        if (searchTerm) {
          data = await searchMovies(searchTerm, currentPage, MOVIES_PER_PAGE);
        } else if (genreFilter) {
          data = await fetchMoviesByGenre(genreFilter, currentPage, MOVIES_PER_PAGE);
        } else {
          data = await fetchTopRatedMovies(currentPage, MOVIES_PER_PAGE);
        }
        setMovies(data.results);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };
    fetchMovies();
  }, [searchTerm, genreFilter, currentPage]);

  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    fetchAllGenres();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleMovieClick = (id) => navigate(`/movie/${id}`);

  return (
    <div className={styles.container}>
      <h1>Top Rated Movies</h1>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchBar}
        />
        <select
          value={genreFilter}
          onChange={handleGenreChange}
          className={styles.genreDropdown}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.moviesList}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={styles.movieCard}
            onClick={() => handleMovieClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              className={styles.movieImage}
            />
            <h3>
              {movie.title} ({new Date(movie.release_date).getFullYear()})
            </h3>
            <p>Rating: {movie.vote_average}</p>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}

export default HomePage;