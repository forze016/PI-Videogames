import React from 'react';
import stl from './Vgcard.module.css';
import { Link } from 'react-router-dom';

export default function Vgcard({ name, image, genres, rating, handleDelete, id }) {
  const genresArray = genres.split(',');
  let formattedGenres;

  if (genresArray.length > 2) {
    formattedGenres = genresArray.slice(0, 2).join(', ');
  } else if (genresArray.length === 1) {
    formattedGenres = genresArray[0];
  } else {
    formattedGenres = genresArray.join(', ') + ' (...)';
  }

  const handleDeleteClick = () => {
    handleDelete();
  };

  return (
    <div className={stl.container}>
      <div className={stl.card}>
      <div className={stl.closeButton}>
        <button className={stl.delate} onClick={handleDeleteClick}>x</button>
      </div>
      <Link className={stl.link} to={'/videogame/' + id}>
        <h4>{name}</h4>
        <img className={stl.imag} src={image} alt='Imagen no encontrada' />
        <p>{formattedGenres}</p>
        <span>{rating}</span>
        </Link>
      </div>
    </div>
  );
}