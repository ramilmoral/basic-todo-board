import { Router } from 'express';

import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from '../controllers/Board.controller.js';

const router = Router();

router.get('/', getBoards);
router.get('/:id', getBoardById);
router.post('/', createBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
