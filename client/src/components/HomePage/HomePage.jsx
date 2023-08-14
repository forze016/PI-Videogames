import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Vgcard from '../Vgcard/Vgcard';
import Paging from '../Paging/Paging';
import stl from '../HomePage/HomePage.module.css';
import genrefilter from '../../actions/genrefilter';
import vgorigin from '../../actions/vgorigin';
import sortvgames from '../../actions/sortvgame';
import SearchBar from '../SearchBar/SearchBar';
import getgenres from '../../actions/getgenres';
import getVideogames from '../../actions/getVideogames';
import deleteVideogame from '../../actions/deletegame';

export default function HomePage() {
  const dispatch = useDispatch();
  const allVgames = useSelector((state) => state.videogames);
  const allgenres = useSelector((state) => state.genres);
  const [currentPage, setCurrentPage] = useState(1);
  const [vgamesPerPage] = useState(8);
  const lastVgameIndex = currentPage * vgamesPerPage;
  const firstVgIndex = lastVgameIndex - vgamesPerPage;
  const currentVgames = allVgames.slice(firstVgIndex, lastVgameIndex);
  const [render, setRender] = useState('');

  const actualPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(getVideogames());
    dispatch(getgenres());
  }, [dispatch]);

  function handleDelete(id) {
    dispatch(deleteVideogame(id));
    alert("The game has been removed");
    dispatch(getVideogames());
  }

  function handleGenreFilter(e) {
    e.preventDefault();
    dispatch(genrefilter(e.target.value));
  }

  function handleOriginFilter(e) {
    dispatch(vgorigin(e.target.value));
    setCurrentPage(1);
  }

  function handleShowAll(e) {
    dispatch(vgorigin('All'));
    dispatch(sortvgames('asc'));
  }

  function handleSortvgames(e) {
    e.preventDefault();
    dispatch(sortvgames(e.target.value));
    setRender(`Order ${e.target.value}`);
  }

  return (
    <div className={stl.c1}>
      <div className={stl.c2}>
        <div>
          <button className={stl.hpbot} onClick={e => { handleShowAll(e) }}>Load all videogames</button>
        </div>
        <div>
          <Link to='/videogame'>
            <button className={stl.hpbot}>Add New Videogame</button>
          </Link>
        </div>
        <div>
          <SearchBar />
        </div>

        <div>
          <select className={stl.hpfilter} onChange={e => handleGenreFilter(e)}>
            <option value="">All Genres</option>
            {allgenres.map(genre => (
              <option key={genre.id} value={genre.name}>{genre.name}</option>
            ))}
          </select>
        </div>

        <div>
          <select className={stl.hpfilter} onChange={e => handleSortvgames(e)} onBlur={e => handleSortvgames(e)}>
            <option value=''>Select...</option>
            <option value='asc'>A-Z</option>
            <option value='desc'>Z-A</option>
            <option value='rating'>Rating</option>
            <option value='date'>Date</option>
          </select>
        </div>
        <div>
          <select className={stl.hpfilter} onChange={e => handleOriginFilter(e)}>
            <option value='All'>Api+DB Games</option>
            <option value='DB'>Db Games</option>
            <option value='API'>Api Games</option>
          </select>
        </div>
      </div>
      <div className={stl.c4}>
        <Paging vgamesPerPage={vgamesPerPage} allVgames={allVgames.length} currpage={currentPage} actualPage={actualPage} />
      </div>
      <div className={stl.c5}>
        {currentVgames && currentVgames.map(p => (
          <Vgcard
            id={p.id}
            name={p.name}
            image={p.image}
            genres={p.genres}
            key={p.id}
            rating={p.rating}
            handleDelete={() => handleDelete(p.id)}
          />
        ))}
      </div>
    </div>
  )
}