'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

export const Card = ({
  card,
  index,
  onEdit,
  onDelete,
  setModalContent,
  setShowModal,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(card.title);
  const [newDescription, setNewDescription] = React.useState(card.description);

  const handleUpdate = async () => {
    if (newTitle.trim() === '') return;
    await onEdit(card._id, { title: newTitle, description: newDescription });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setModalContent({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this card?',
      onConfirm: () => {
        onDelete(card._id);
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
      showCancel: true,
    });
    setShowModal(true);
  };

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white p-3 mb-2 rounded-lg shadow-sm border border-gray-200
            ${snapshot.isDragging ? 'transform rotate-2 shadow-lg' : ''}
            hover:shadow-md transition-shadow duration-150 ease-in-out
          `}
        >
          {isEditing ? (
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdate();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="w-full p-2 border border-blue-300 rounded-md mb-2 focus:ring-blue-400 focus:border-blue-400"
                autoFocus
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleUpdate();
                  }
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                rows="3"
                className="w-full p-2 border border-blue-300 rounded-md text-sm focus:ring-blue-400 focus:border-blue-400"
                placeholder="Add a description..."
              />
              <button
                onClick={handleUpdate}
                className="mt-2 w-full bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-gray-800 text-base">
                {card.title}
              </h4>
              {card.description && (
                <p className="text-gray-600 text-sm mt-1">{card.description}</p>
              )}
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title="Edit Card"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.64 4.877L5.172 16.5V19h2.5l6.818-6.818-2.828-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete Card"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
