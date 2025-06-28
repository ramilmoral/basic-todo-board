import { Router } from 'express';
const router = Router();
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from '../controllers/Board.controller.js';

router.get('/', getBoards);
router.get('/:id', getBoardById);
router.post('/', createBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
