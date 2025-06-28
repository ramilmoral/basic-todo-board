import Card from '../models/Card.schema.js';

// Create a new card
export const getCard = async (req, res) => {
  try {
    const { title, description, listId, order } = req.body;
    const newCard = new Card({ title, description, list: listId, order });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cards for a specific list
export const getCardById = async (req, res) => {
  try {
    const cards = await Card.find({ list: req.params.listId }).sort({
      order: 1,
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a card
export const updateCard = async (req, res) => {
  try {
    const { title, description, listId, order } = req.body;
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { title, description, list: listId, order },
      { new: true }
    );
    if (!updatedCard)
      return res.status(404).json({ message: 'Card not found' });
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a card
export const deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard)
      return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to update the order and/or list of multiple cards (e.g., after drag and drop)
export const updateCards = async (req, res) => {
  try {
    const updates = req.body; // Array of { _id, listId, order } objects

    const operations = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: { list: update.listId, order: update.order } },
      },
    }));

    if (operations.length > 0) {
      await Card.bulkWrite(operations);
    }

    res.json({ message: 'Card orders and/or lists updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
