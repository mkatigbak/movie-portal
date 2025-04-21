import React from 'react';
import styles from '../styles/MovieDetailsPage.module.css';

function MovieDetailsModal({ children }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
}

export default MovieDetailsModal;