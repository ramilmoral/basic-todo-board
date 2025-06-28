import { Router } from 'express';
const router = Router();
import {
  getBoardList,
  createList,
  updateList,
  updateLists,
  deleteList,
} from '../controllers/List.controller.js';

router.get('/:boardId', getBoardList);
router.post('/', createList);
router.put('/:id', updateList);
router.put('/update-order/multiple', updateLists);
router.delete('/:id', deleteList);

export default router;
