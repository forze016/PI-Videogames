const { Router } = require('express');
const {Genre} = require('../db');
const router = Router();

router.get('/', async (req, res) => {
    try{
        const vgGenres = await Genre.findAll()
        res.status(200).json(vgGenres);
    } catch (error) {
        res.send (`Error in Toure /genres ${error}`);
    }
})

module.exports = router;