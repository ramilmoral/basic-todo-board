import { Router } from 'express';

import {
  getCard,
  getCardById,
  updateCard,
  updateCards,
  deleteCard,
} from '../controllers/Card.controller.js';

const router = Router();

router.get('/', getCard);
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.put('/update-order/multiple', updateCards);
router.delete('/:id', deleteCard);

export default router;
