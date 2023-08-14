import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import postvgame from '../../actions/postvgame';
import getvgames from '../../actions/getVideogames';
import stl from './AddVideogame.module.css';
import getgenres from '../../actions/getgenres';
import getplatforms from '../../actions/getplatforms';

function validate(input) {
  let errors = {};
  if (!input.name) {
    errors.name = 'Name is required';
  } else if (!input.rating || input.rating < 0 || input.rating > 5) {
    errors.rating = 'Rating must be a number between 0-5';
  }
  return errors;
}

export default function AddVideogame() {
  const dispatch = useDispatch();
  const history = useLocation();

  useEffect(() => {
    dispatch(getgenres());
    dispatch(getplatforms());
  }, []);

  const [input, setInput] = useState({
    name: '',
    image:'',
    description: '',
    reldate: '',
    rating: '',
    platform: [],
    genre: []
  });
  const [errors, setErrors] = useState({});
  let allgenres = useSelector((state) => state.genres);
  const allplatforms = useSelector((state) => state.platforms);
  allgenres = allgenres.filter((p) => p !== 'All');

  const handleOnChange = (e) => {
    setInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    setErrors((prevErrors) => validate({ ...input, [e.target.name]: e.target.value }));
  };

  const handlePlatforms = (e) => {
    const platform = e.target.value;
  
    if (e.target.checked) {
      setInput((prevState) => ({
        ...prevState,
        platform: [...prevState.platform, platform]
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        platform: prevState.platform.filter((p) => p !== platform)
      }));
    }
  };

  const handleGenresChange = (ev) => {
    const genre = ev.target.value;
  
    if (ev.target.checked) {
      setInput((prevState) => ({
        ...prevState,
        genre: [...prevState.genre, genre]
      }));
    } else {
      setInput((prevState) => ({
        ...prevState,
        genre: prevState.genre.filter((g) => g !== genre)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.name) {
      return alert('Name is required');
    }
    if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(input.reldate)) {
      return alert('Wrong released date format. Should be YYYY-MM-DD OR YYYY-M-D');
    }
    if (!input.rating) {
      return alert('Rating is required');
    }
    if (
      !/^(?:[1-9]\d{0,2}(?:,\d{3})*|0)(?:\.\d+)?$/.test(input.rating) ||
      input.rating < 0 ||
      input.rating > 5
    ) {
      return alert('Wrong format for Rating. Should be a number between 0-5');
    }
    if (input.platform.length === 0) {
      return alert('Platform is required');
    }
    dispatch(postvgame(input));
    dispatch(getvgames());
    alert(`Videogame ${input.name} has been added`);
    setInput({
      name: '',
      image:'',
      description: '',
      reldate: '',
      rating: 0,
      platform: [],
      genre: []
    });
    //  history('/home')
  };

  return (
    <>
      <div className={stl.avgwrapper}>
        <h1 className={stl.h1}>Add your own videogame</h1>
        <form className={stl.formarea} onSubmit={handleSubmit}>
          <div className={stl.msgarea}>
            <label>Description:</label>
            <textarea
              onChange={handleOnChange}
              type="text"
              name="description"
              value={input.description}
            />
          </div>
          <div className={stl.detailsarea}>
            <label>Game Name:</label>
            <input
              onChange={handleOnChange}
              onBlur={handleOnChange}
              type="text"
              name="name"
              value={input.name}
              autoComplete="off"
            />
            {errors.name && <p className={stl.error}> {errors.name} </p>}

            <label>Image</label>
            <input
            onChange={handleOnChange}
            type="text"
            name='image'
            value={input.image}
            autoComplete="off" 
            placeholder="URL"/>

            <label>Released date:</label>
            <input
              onChange={handleOnChange}
              type="date"
              name="reldate"
              value={input.reldate}
              placeholder="YYYY-MM-DD"
            />

            <label>Rating:</label>
            <input
              onChange={handleOnChange}
              onBlur={handleOnChange}
              type="text"
              name="rating"
              value={input.rating}
              autoComplete="off"
              placeholder="ex 4.3"
            />
            {errors.rating && <p className={stl.error}> {errors.rating} </p>}

            <label>Select Platforms:</label>
            <div className={stl.checkboxContainer}>
              {allplatforms.sort().map((p) => {
                return (
                  <div key={p}>
                    <input
                      type="checkbox"
                      value={p}
                      onChange={handlePlatforms}
                    />
                    <label>{p}</label>
                  </div>
                );
              })}
            </div>
            <ul className="ul">
              <li>{input.platform.map((p) => p + ' ,')}</li>
            </ul>
            {errors.platform && <p className={stl.error}> {errors.platform} </p>}

            <label>Select Genres:</label>
            {allgenres.sort().map((p) => {
              return (
                <div key={p.id} className={stl.checkboxContainer}>
                  <input
                    type="checkbox"
                    value={p.id}
                    onChange={handleGenresChange}
                  />
                  <label>{p.name}</label>
                </div>
              );
            })}

            <ul>
              <li>{input.genre.map((p) => p + ' ,')}</li>
            </ul>

            <button className={stl.bot} type="submit">
              Add Game
            </button>
            <span>
              <Link to="/home">
                <button className={stl.bot2}>Back To Home</button>
              </Link>{' '}
            </span>
          </div>
        </form>
      </div>
      <div />
    </>
  );
}