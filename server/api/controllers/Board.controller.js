import Board from '../models/Board.schema.js';
import List from '../models/List.schema.js';
import { BOARD } from '../enums/board.enums.js';

// Create a new board
export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const newBoard = new Board({ title });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all boards
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({});
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single board by ID (and potentially its lists/cards later)
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: BOARD.NOT_FOUND });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a board
export const updateBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true } // Returns the updated document
    );
    if (!updatedBoard)
      return res.status(404).json({ message: BOARD.NOT_FOUND });
    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a board (and its associated lists and cards)
export const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;

    // Find all lists associated with the board
    const listsToDelete = await List.find({ board: boardId });
    const listIds = listsToDelete.map((list) => list._id);

    // Delete all cards associated with these lists
    await Card.deleteMany({ list: { $in: listIds } });

    // Delete all lists associated with the board
    await List.deleteMany({ board: boardId });

    // Delete the board itself
    const deletedBoard = await Board.findByIdAndDelete(boardId);
    if (!deletedBoard)
      return res.status(404).json({ message: BOARD.NOT_FOUND });

    res.json({
      message: BOARD.DELETED_SUCCESSFULLY,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
