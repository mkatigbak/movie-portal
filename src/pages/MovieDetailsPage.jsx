import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../api/tmdbApi";
import MovieDetailsModal from "../components/MovieDetailsModal";
import styles from "../styles/MovieDetailsPage.Module.css";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchMovieDetails(id);
        setMovieDetails(data);
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
      }
    };
    fetchDetails();
  }, [id]);

  if (!movieDetails) {
    return <p>Loading...</p>;
  }

  return (
    <MovieDetailsModal>
      <div className={styles.detailsContainer}>
        <button onClick={() => navigate(-1)}>Back</button>
        <img
          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
          alt={`${movieDetails.title} poster`}
          className={styles.movieImage}
        />
        <div>
          <h2>{movieDetails.title} ({new Date(movieDetails.release_date).getFullYear()})</h2>
          <p>{movieDetails.overview}</p>
          <h3>Cast:</h3>
          <ul>
            {movieDetails.credits?.cast?.length > 0 ? (
              movieDetails.credits.cast.slice(0, 5).map((castMember) => (
                <li key={castMember.id}>
                  {castMember.name} as {castMember.character}
                </li>
              ))
            ) : (
              <p>No cast information available.</p>
            )}
          </ul>
          <p>Rating: {movieDetails.vote_average}</p>
        </div>
      </div>
    </MovieDetailsModal>
  );
}

export default MovieDetailsPage;