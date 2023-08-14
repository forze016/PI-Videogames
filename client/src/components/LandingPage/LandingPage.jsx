import React, { useEffect } from "react";
import {useDispatch} from 'react-redux';
import { Link } from "react-router-dom";
import getvgames from "../../actions/getVideogames";
import sortvgames from '../../actions/sortvgame';
import stl from './LandingPage.module.css'

export default function LandingPage() {
    const dispatch = useDispatch();


    //Get Genres from API

    useEffect (() => {
        dispatch(getvgames()); 
     },[]) 
     
     function handleSortvgames(e) {
        dispatch(sortvgames('asc'))
    }  

    return (
        <div className={stl.lpcontainer}> 
           < Link to = '/home'> 
           <button className={stl.but} onClick={handleSortvgames}>START App</button>
           </Link>
        </div>
     )   
}