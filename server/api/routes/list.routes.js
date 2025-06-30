import { Router } from 'express';

import {
  getBoardList,
  createList,
  updateList,
  updateLists,
  deleteList,
} from '../controllers/List.controller.js';

const router = Router();

router.get('/:boardId', getBoardList);
router.post('/', createList);
router.put('/:id', updateList);
router.put('/update-order/multiple', updateLists);
router.delete('/:id', deleteList);

export default router;
