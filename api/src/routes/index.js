const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const vgameRouter = requiere('./videogames');
const genreRouter = requiere ('./genre');
const platformRouter = requiere ('./platforms');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('./videogames', vgameRouter);
router.use('/genre', genreRouter);
router.use('/platforms', platformRouter)


module.exports = router;
