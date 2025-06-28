'use client'; // This directive ensures the component is treated as a client-side component

import React, { useState, useEffect, useCallback } from 'react';
import { Board } from '@/components/Board';
import { Modal } from '@/components/Modal';
import { createBoard, deleteBoard, getBoards } from '@/api';

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [isLoadingBoards, setIsLoadingBoards] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
    showCancel: true,
  });

  const fetchBoards = useCallback(async () => {
    setIsLoadingBoards(true);
    try {
      const fetchedBoards = await getBoards();
      setBoards(fetchedBoards);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      setModalContent({
        title: 'Connection Error',
        message:
          'Failed to load boards. Please ensure your backend server is running on http://localhost:4000.',
        onConfirm: () => setShowModal(false),
        showCancel: false,
      });
      setShowModal(true);
    } finally {
      setIsLoadingBoards(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async () => {
    if (newBoardTitle.trim() === '') {
      setIsAddingBoard(false);
      return;
    }
    try {
      const newBoard = await createBoard(newBoardTitle);
      setBoards([...boards, newBoard]);
      setNewBoardTitle('');
      setIsAddingBoard(false);
      setSelectedBoardId(newBoard._id); // Automatically open the new board
    } catch (error) {
      console.error('Failed to create board:', error);
      setModalContent({
        title: 'Error',
        message: 'Failed to create board. Please try again.',
        onConfirm: () => setShowModal(false),
        showCancel: false,
      });
      setShowModal(true);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    setModalContent({
      title: 'Confirm Deletion',
      message:
        'Are you sure you want to delete this board and all its contents (lists and cards)? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteBoard(boardId);
          setBoards(boards.filter((board) => board._id !== boardId));
          if (selectedBoardId === boardId) {
            setSelectedBoardId(null); // Deselect if the current board is deleted
          }
        } catch (error) {
          console.error('Failed to delete board:', error);
          setModalContent({
            title: 'Error',
            message: 'Failed to delete board. Please try again.',
            onConfirm: () => setShowModal(false),
            showCancel: false,
          });
          setShowModal(true);
        }
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
      showCancel: true,
    });
    setShowModal(true);
  };

  if (selectedBoardId) {
    return (
      <Board
        boardId={selectedBoardId}
        onBackToBoards={() => setSelectedBoardId(null)}
        setGlobalModalContent={setModalContent} // Pass modal state setters
        setGlobalShowModal={setShowModal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-800 flex flex-col items-center justify-center p-4">
      {showModal && <Modal {...modalContent} />}

      <h1 className="text-5xl font-extrabold text-white mb-10 text-center tracking-wide drop-shadow-lg">
        Trello Clone
      </h1>

      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-xl shadow-2xl p-8 backdrop-blur-sm">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-4 border-gray-200">
          Your Boards
        </h2>

        {isLoadingBoards ? (
          <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
            Loading boards...
          </div>
        ) : (
          <>
            {boards.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No boards yet! Create one to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {boards.map((board) => (
                  <div
                    key={board._id}
                    className="relative bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer group flex flex-col justify-between"
                    onClick={() => setSelectedBoardId(board._id)}
                  >
                    <h3 className="text-xl font-bold text-blue-800 mb-2">
                      {board.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening the board when deleting
                        handleDeleteBoard(board._id);
                      }}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Delete Board"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          {isAddingBoard ? (
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onBlur={handleCreateBoard}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg w-full"
                placeholder="Enter new board title..."
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateBoard}
                  className="flex-grow bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Create Board
                </button>
                <button
                  onClick={() => setIsAddingBoard(false)}
                  className="flex-grow bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition-colors shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingBoard(true)}
              className="w-full bg-blue-500 text-white py-4 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200 text-xl font-medium flex items-center justify-center space-x-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Add New Board</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
