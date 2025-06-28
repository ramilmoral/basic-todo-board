import { Router } from 'express';
const router = Router();
import {
  getCard,
  getCardById,
  updateCard,
  updateCards,
  deleteCard,
} from '../controllers/Card.controller.js';

router.get('/', getCard);
router.get('/:id', getCardById);
router.put('/:id', updateCard);
router.put('/update-order/multiple', updateCards);
router.delete('/:id', deleteCard);

export default router;
