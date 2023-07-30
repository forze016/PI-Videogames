const { Router } = require('express');
const axios = require('../db');
const router = Router();

router.get('/', async (req, res) => {
    try{
        const vgGenres = await Genre.findAll({
            attributes: ['name']
        })
        let dbGenre = vgGenres.map(p => p.name)
        res.status(200).send(dbGenres);
    } catch (error) {
        res.send (`Error in Toure /genres ${error}`);
    }
})

module.exports = router;