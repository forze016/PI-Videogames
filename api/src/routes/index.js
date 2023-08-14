const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const vgameRouter = require('./videogames');
const genreRouter = require ('./genre');
const platformRouter = require('./platforms');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/videogames', vgameRouter);
router.use('/genre', genreRouter);
router.use('/platforms',platformRouter);

module.exports = router;
