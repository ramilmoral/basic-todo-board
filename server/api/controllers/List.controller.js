import List from '../models/List.schema.js';
import Card from '../models/Card.schema.js';
import { LIST } from '../enums/list.enums.js';

// Create a new list
export const createList = async (req, res) => {
  try {
    const { title, boardId, order } = req.body;
    const newList = new List({ title, board: boardId, order });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all lists for a specific board
export const getBoardList = async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort({
      order: 1,
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a list
export const updateList = async (req, res) => {
  try {
    const { title, order } = req.body;
    const updatedList = await List.findByIdAndUpdate(
      req.params.id,
      { title, order },
      { new: true }
    );
    if (!updatedList) return res.status(404).json({ message: LIST.NOT_FOUND });
    res.json(updatedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to update the order of multiple lists (e.g., after drag and drop) /put
export const updateLists = async (req, res) => {
  try {
    const updates = req.body; // Array of { _id, order } objects

    const operations = updates.map((update) => ({
      updateOne: {
        filter: { _id: update._id },
        update: { $set: { order: update.order } },
      },
    }));

    if (operations.length > 0) {
      await List.bulkWrite(operations);
    }

    res.json({ message: LIST.UPDATED_SUCCESSFULLY });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a list (and its associated cards)
export const deleteList = async (req, res) => {
  try {
    const listId = req.params.id;

    // Delete all cards associated with this list
    await Card.deleteMany({ list: listId });

    // Delete the list itself
    const deletedList = await List.findByIdAndDelete(listId);
    if (!deletedList) return res.status(404).json({ message: LIST.NOT_FOUND });

    res.json({ message: LIST.DELETED_SUCCESSFULLY });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
