'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DraggableBoardContent } from './DraggableBoardContent';
import {
  createCard,
  createList,
  getCardsByList,
  deleteList,
  deleteCard,
  getBoardById,
  getListsByBoard,
  updateList,
  updateCard,
  updateListOrder,
  updateCardOrderAndList,
} from '@/api';

export const Board = ({
  boardId,
  onBackToBoards,
  setGlobalModalContent,
  setGlobalShowModal,
}) => {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cardsByList, setCardsByList] = useState({}); // { listId: [card1, card2], ... }
  const [newListName, setNewListName] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBoard = await getBoardById(boardId);
      setBoard(fetchedBoard);

      const fetchedLists = await getListsByBoard(boardId);
      setLists(fetchedLists);

      const cardsData = {};
      for (const list of fetchedLists) {
        const fetchedCards = await getCardsByList(list._id);
        cardsData[list._id] = fetchedCards;
      }
      setCardsByList(cardsData);
    } catch (err) {
      console.error('Failed to fetch board data:', err);
      setError('Failed to load board. Please try again.');
      setGlobalModalContent({
        title: 'Error',
        message:
          'Failed to load board data. Please ensure the backend server is running and accessible.',
        onConfirm: () => setGlobalShowModal(false),
        showCancel: false,
      });
      setGlobalShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, setGlobalModalContent, setGlobalShowModal]);

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  const handleAddList = async () => {
    if (newListName.trim() === '') {
      setIsAddingList(false);
      return;
    }
    try {
      const newOrder =
        lists.length > 0 ? Math.max(...lists.map((l) => l.order)) + 1 : 0;
      const newList = await createList(newListName, boardId, newOrder);
      setLists((prevLists) =>
        [...prevLists, newList].sort((a, b) => a.order - b.order)
      );
      setCardsByList((prevCards) => ({ ...prevCards, [newList._id]: [] }));
      setNewListName('');
      setIsAddingList(false);
    } catch (err) {
      console.error('Failed to add list:', err);
      setError('Failed to add list.');
      setGlobalModalContent({
        title: 'Error',
        message: 'Failed to add list. Please try again.',
        onConfirm: () => setGlobalShowModal(false),
        showCancel: false,
      });
      setGlobalShowModal(true);
    }
  };

  const handleUpdateList = async (listId, data) => {
    try {
      const updatedList = await updateList(listId, data);
      setLists((prevLists) =>
        prevLists.map((list) => (list._id === listId ? updatedList : list))
      );
    } catch (err) {
      console.error('Failed to update list:', err);
      setError('Failed to update list.');
      setGlobalModalContent({
        title: 'Error',
        message: 'Failed to update list. Please try again.',
        onConfirm: () => setGlobalShowModal(false),
        showCancel: false,
      });
      setGlobalShowModal(true);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      setLists((prevLists) => prevLists.filter((list) => list._id !== listId));
      setCardsByList((prevCards) => {
        const newCards = { ...prevCards };
        delete newCards[listId];
        return newCards;
      });
    } catch (err) {
      console.error('Failed to delete list:', err);
      setError('Failed to delete list.');
      setGlobalModalContent({
        title: 'Error',
        message: 'Failed to delete list. Please try again.',
        onConfirm: () => setGlobalShowModal(false),
        showCancel: false,
      });
      setGlobalShowModal(true);
    }
  };

  const handleAddCard = async (listId, title, order) => {
    try {
      const newCard = await createCard(title, '', listId, order);
      setCardsByList((prevCards) => ({
        ...prevCards,
        [listId]: [...(prevCards[listId] || []), newCard].sort(
          (a, b) => a.order - b.order
        ),
      }));
    } catch (err) {
      console.error('Failed to add card:', err);
      setError('Failed to add card.');
      setGlobalModalContent({
        title: 'Error',
        message: 'Failed to add card. Please try again.',
        onConfirm: () => setGlobalShowModal(false),
        showCancel: false,
      });
      setGlobalShowModal(true);
    }
  };

  const handleUpdateCard = async (cardId, data) => {
    try {
      const updatedCard = await updateCard(cardId, data);
      setCardsByList((prevCards) => {
        const newCardsByList = { ...prevCards };
        for (const listId in newCardsByList) {
          newCardsByList[listId] = newCardsByList[listId].map(
            (card) => (card._id === cardId ? { ...card, ...data } : card) // Merge updates
          );
        }
        return newCardsByList;
      });
    } catch (err) {
      console.error('Failed to update card:', err);
      setError('Failed to update card.');
      setGlobalModalContent({
        title: 'Error',
        message: 'Failed to update card. Please try again.',
        onConfirm: () => setGlobalShowModal(false),
        showCancel: false,
      });
      setGlobalShowModal(true);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId);
      setCardsByList((prevCards) => {
        const newCardsByList = { ...prevCards };
        for (const listId in newCardsByList) {
          newCardsByList[listId] = newCardsByList[listId].filter(
            (card) => card._id !== cardId
          );
        }
        return newCardsByList;
      });
    } catch (err) {
      console.error('Failed to delete card:', err);
      setError('Failed to delete card.');
      setGlobalModalContent({
        title: 'Error',
        message: 'Failed to delete card. Please try again.',
        onConfirm: () => setGlobalShowModal(false),
        showCancel: false,
      });
      setGlobalShowModal(true);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result;

    // Dropped outside a valid droppable area
    if (!destination) return;

    // Dropped in the same spot
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === 'list') {
      const newLists = Array.from(lists);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

      // Update order property for all affected lists
      const updatedListOrder = newLists.map((list, index) => ({
        _id: list._id,
        order: index,
      }));

      setLists(newLists);
      try {
        await updateListOrder(updatedListOrder);
      } catch (err) {
        console.error('Failed to update list order:', err);
        setError('Failed to update list order on server.');
        setGlobalModalContent({
          title: 'Error',
          message: 'Failed to update list order on server. Please try again.',
          onConfirm: () => setGlobalShowModal(false),
          showCancel: false,
        });
        setGlobalShowModal(true);
        setLists(lists);
      }
      return;
    }

    // Handle card drag and drop
    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    let sourceCards = Array.from(cardsByList[sourceListId]);
    let destinationCards = Array.from(cardsByList[destinationListId]);
    const movedCard = sourceCards.find((card) => card._id === draggableId);

    if (!movedCard) return; // Should not happen

    let updates = [];

    if (sourceListId === destinationListId) {
      // Moving within the same list
      sourceCards.splice(source.index, 1);
      sourceCards.splice(destination.index, 0, {
        ...movedCard,
        list: destinationListId,
      }); // Ensure listId is correct

      const updatedSourceCards = sourceCards.map((card, index) => {
        if (card.order !== index) {
          updates.push({
            _id: card._id,
            listId: destinationListId,
            order: index,
          });
          return { ...card, order: index };
        }
        return card;
      });
      setCardsByList((prev) => ({
        ...prev,
        [sourceListId]: updatedSourceCards,
      }));
    } else {
      // Moving between different lists
      sourceCards.splice(source.index, 1); // Remove from source list
      destinationCards.splice(destination.index, 0, {
        ...movedCard,
        list: destinationListId,
      }); // Add to destination list

      // Update order and listId for affected cards
      const updatedSourceCards = sourceCards.map((card, index) => {
        if (card.order !== index) {
          updates.push({ _id: card._id, listId: sourceListId, order: index });
          return { ...card, order: index };
        }
        return card;
      });

      const updatedDestinationCards = destinationCards.map((card, index) => {
        if (card.order !== index || card.list !== destinationListId) {
          updates.push({
            _id: card._id,
            listId: destinationListId,
            order: index,
          });
          return { ...card, list: destinationListId, order: index };
        }
        return card;
      });

      setCardsByList((prev) => ({
        ...prev,
        [sourceListId]: updatedSourceCards,
        [destinationListId]: updatedDestinationCards,
      }));
    }

    // Send bulk update to backend
    if (updates.length > 0) {
      try {
        await updateCardOrderAndList(updates);
      } catch (err) {
        console.error('Failed to update card order/list on server:', err);
        setError('Failed to update card position on server. Please refresh.');
        setGlobalModalContent({
          title: 'Error',
          message: 'Failed to update card position on server. Please refresh.',
          onConfirm: () => setGlobalShowModal(false),
          showCancel: false,
        });
        setGlobalShowModal(true);
        fetchBoardData(); // Revert to server state on error
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="text-xl">Loading board...</div>
      </div>
    );
  }

  if (error) {
    // This error display is for internal component errors, global modal handles API errors
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
        <p className="mb-4 text-lg">{error}</p>
        <button
          onClick={onBackToBoards}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
        >
          Back to Boards
        </button>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="mb-4 text-lg">Board not found or could not be loaded.</p>
        <button
          onClick={onBackToBoards}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Back to Boards
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
      <header className="p-4 bg-black bg-opacity-20 flex items-center shadow-md">
        <button
          onClick={onBackToBoards}
          className="mr-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white"
          title="Back to Boards"
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
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
        </button>
        <h1 className="text-3xl font-bold flex-grow">{board.title}</h1>
      </header>

      <DraggableBoardContent
        lists={lists}
        cardsByList={cardsByList}
        onAddCard={handleAddCard}
        onUpdateList={handleUpdateList}
        onDeleteList={handleDeleteList}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onDragEnd={onDragEnd}
        newListName={newListName}
        isAddingList={isAddingList}
        setNewListName={setNewListName}
        handleAddList={handleAddList}
        setIsAddingList={setIsAddingList}
        setGlobalModalContent={setGlobalModalContent}
        setGlobalShowModal={setGlobalShowModal}
      />
    </div>
  );
};
