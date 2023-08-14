const express = require('express');
const {apikey, Videogame, Genre, conn} = require('../db');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {  
    const {name} = req.query;
     try { 
        if (name) {
           let sname = name.split(' ').join('-').toLowerCase()
           var apiresult = await axios.get(`https://api.rawg.io/api/games?search=${sname}&key=${apikey}&page_size=100`)
           apiresult = apiresult.data.results
        } else {
            async function SearchApi () {
              try { 
                 const promise1 = axios.get(`https://api.rawg.io/api/games?key=${apikey}&page=1&page_size=50`);
                 const promise2 = axios.get(`https://api.rawg.io/api/games?key=${apikey}&page=2&page_size=50`);
                 const promise3 = axios.get(`https://api.rawg.io/api/games?key=${apikey}&page=3&page_size=50`);
  
                 await Promise.all([promise1, promise2, promise3])
                    .then(function(values) {
                       apiresult = values[0].data.results.concat(values[1].data.results).concat(values[2].data.results)
                    })
              } catch (err) {
                   console.log('Error searchin the API: ', err)
              }
            }
            await SearchApi()
          }    
          if (apiresult.length > 0) {  
            var apivgames = apiresult.map(p => {
              let b=[]
              for (i=0;i<p.genres.length;i++) {
                  b.push(p.genres[i].name)
             }
             return {
                id:p.id,
                name: p.name,
                image: p.background_image,
                genres: b.toString(),
                rating: p.rating,
                origin: 'API'
              }
           })  
           if (name) {
            apivgames = apivgames.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))     
         }      
        } else var apivgames = []

      //Search Videogames from local Database
        var dbvgames = []
        dbvgames = await Videogame.findAll({
          include: {
             model: Genre,
             attributes: ['name'],
             through: {attributes: [] }
          }  
        })  
        if (name) {
           dbvgames = dbvgames.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))     
        }
        var dbvgames = dbvgames.map(p => {
            let b=[]
            for (i=0;i<p.genres.length;i++) {
                b.push(p.genres[i].name)
            }
            return {
               id: p.id,
               name: p.name,
               image: p.image,
               genres: b.toString(),
               rating: p.rating,
               origin: 'DB'
            }
        })           
      //Join and return resultss
      const allvgames = dbvgames.concat(apivgames)
      res.json(allvgames.length ? allvgames : 'No videogames found');
    } catch (error) {
      res.send(`Error in route /videogames ${error}`);
    }
  });
  
//Search a videogame by id
  router.get('/:id', async (req, res) => {  
    const {id} = req.params;
    try {
      if (!isNaN(id)){
    //Search videogame in the Api
         var idkey = parseInt(id)
         const result = await axios.get(`https://api.rawg.io/api/games/${idkey}?key=${apikey}`)
         if (result.data.id) {
            let genrestr=[]
            for (i=0;i<result.data.genres.length;i++) {
                genrestr.push(result.data.genres[i].name)
            } 
            let platformstr=[]
            for (i=0;i<result.data.platforms.length;i++) {
              platformstr.push(result.data.platforms[i].platform.name)
            } 
            const searchapivg = {
              name: result.data.name,
              platforms: platformstr.toString(),
              released: result.data.released, 
              image: result.data.background_image,
              description: result.data.description.replace(/<[^>]+>/g, ''),
              rating: result.data.rating,
              genres: genrestr.toString()
            }
            return res.status(200).json(searchapivg)
         }
      }
  //Search videogame in local Database  
      var searchdbvg  = await Videogame.findByPk(id, {
          include: [{
             model: Genre,
             attributes: ['name'],
             through: {
               attributes: []
             }
          }]
      });
       
      if (searchdbvg) {
         let genrestr=[]
         for (let i=0;i<searchdbvg.genres.length;i++) {
             genrestr.push(searchdbvg.genres[i].name)
         }
         const objdbgame = {
            name: searchdbvg.name,
            platforms: searchdbvg.platform, //platform
            released: searchdbvg.reldate, //reldate
            image: searchdbvg.image,
            description: searchdbvg.description,
            rating: searchdbvg.rating,
            genres: genrestr.toString()
         }
         return res.status(200).json(objdbgame)
      }  
      return res.status(404).send('Videogame not found');
    } catch (error) {
      res.send(`Error in Rute /videogames:id ${error}`);
    }
  });

// Ruta para borrar un videojuego
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVideogame = await Videogame.destroy({
      where: { id },
    });

    if (deletedVideogame === 0) {
      return res.status(404).send('Videogame not found');
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al borrar el videojuego');
  }
});

// Ruta para editar la información de un videojuego
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, reldate, rating, genre, platform } = req.body;

  try {
    await Videogame.update(
      { name, image, description, reldate, rating, genre, platform },
      { where: { id } }
    );
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al editar el videojuego');
  }
});

//Add a videogame to the database
  router.post('/', async (req, res) => {  
     let { name, image, description, reldate, rating, genre, platform} = req.body;
    //  platform = platform.toString();
    console.log(req.body)
     const addVgame = await Videogame.create({
        name,
        image,
        description,
        reldate,
        rating, 
        genre:[],
        platform: platform,
     })

// Encuentra los géneros correspondientes a los IDs seleccionados
const vg_genres = await Genre.findAll({
  where: { id: genre }
});

// Asocia los géneros al videojuego utilizando el método addGenres
addVgame.addGenres(vg_genres);

res.send('Nuevo videojuego ha sido agregado')
   });

  module.exports = router;
  