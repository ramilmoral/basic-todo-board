'use client';

import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

// List Component (Copied from previous App.js to be self-contained for this draggable context)
export const List = ({
  list,
  index,
  cards,
  onAddCard,
  onUpdateList,
  onDeleteList,
  onUpdateCard,
  onDeleteCard,
  setModalContent,
  setShowModal,
}) => {
  const [newCardTitle, setNewCardTitle] = React.useState('');
  const [isAddingCard, setIsAddingCard] = React.useState(false);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [newListName, setNewListName] = React.useState(list.title);

  const handleAddCard = async () => {
    if (newCardTitle.trim() === '') {
      setIsAddingCard(false); // Close if empty
      return;
    }
    const newOrder =
      cards.length > 0 ? Math.max(...cards.map((c) => c.order)) + 1 : 0;
    await onAddCard(list._id, newCardTitle, newOrder);
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  const handleUpdateListName = async () => {
    if (newListName.trim() === '') {
      setNewListName(list.title); // Revert to original if empty
    } else if (newListName !== list.title) {
      await onUpdateList(list._id, { title: newListName });
    }
    setIsEditingTitle(false);
  };

  const handleDeleteListClick = () => {
    setModalContent({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this list and all its cards?',
      onConfirm: () => {
        onDeleteList(list._id);
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
      showCancel: true,
    });
    setShowModal(true);
  };

  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-72 bg-gray-100 rounded-lg p-3 flex flex-col flex-shrink-0 mr-4 shadow-md"
        >
          <div
            {...provided.dragHandleProps}
            className="flex justify-between items-center mb-3"
          >
            {isEditingTitle ? (
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onBlur={handleUpdateListName}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateListName()}
                className="font-semibold text-lg p-1 rounded-md w-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              />
            ) : (
              <h3
                className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-blue-700 transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {list.title}
              </h3>
            )}
            <button
              onClick={handleDeleteListClick}
              className="ml-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete List"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <Droppable droppableId={list._id} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  flex-grow min-h-[50px] rounded-md transition-colors duration-200
                  ${snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-100'}
                `}
              >
                {cards.map((card, idx) => (
                  <Card
                    key={card._id}
                    card={card}
                    index={idx}
                    onEdit={onUpdateCard}
                    onDelete={onDeleteCard}
                    setModalContent={setModalContent}
                    setShowModal={setShowModal}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {isAddingCard ? (
            <div className="mt-3">
              <input
                type="text"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onBlur={handleAddCard}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
                className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-400 focus:border-blue-400 mb-2"
                placeholder="Enter card title..."
                autoFocus
              />
              <button
                onClick={handleAddCard}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                Add Card
              </button>
              <button
                onClick={() => setIsAddingCard(false)}
                className="w-full mt-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors shadow-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCard(true)}
              className="mt-3 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Add a card</span>
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};
