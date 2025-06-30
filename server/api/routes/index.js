import express from 'express';
import boardRoutes from './board.routes.js';
import cardRoutes from './card.routes.js';
import listRoutes from './list.routes.js';

const router = express.Router();

router.use('/boards', boardRoutes);
router.use('/cards', cardRoutes);
router.use('/lists', listRoutes);

export default router;
