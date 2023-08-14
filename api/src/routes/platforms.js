const express = require('express');
const axios = require('axios');
const router = express.Router();
const { apikey } = require('../db')

//Search all videogames platforms
router.get('/', async (req, res) => {
  try {
    const apiresult = await axios.get(`https://api.rawg.io/api/platforms/lists/parents?key=${apikey}`);
     const apivgplat = apiresult.data.results.map(p => p.name);
console.log(apikey)
    res.json(apivgplat);
  } catch (error) {
    console.error('Error al obtener las plataformas de videojuegos:', error);
    res.status(500).send('Error al obtener las plataformas de videojuegos');
  }
});

module.exports = router;