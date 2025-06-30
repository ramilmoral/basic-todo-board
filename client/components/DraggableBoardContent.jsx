'use client';

import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { List } from './List';

// This component wraps the DragDropContext
export const DraggableBoardContent = ({
  lists,
  cardsByList,
  onAddCard,
  onUpdateList,
  onDeleteList,
  onUpdateCard,
  onDeleteCard,
  onDragEnd,
  newListName,
  isAddingList,
  setNewListName,
  handleAddList,
  setIsAddingList,
  setGlobalModalContent,
  setGlobalShowModal,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-grow p-4 overflow-x-auto items-start board-container"
          >
            {lists &&
              lists.map((list, index) => (
                <List
                  key={list._id}
                  list={list}
                  index={index}
                  cards={cardsByList[list._id] || []}
                  onAddCard={onAddCard}
                  onUpdateList={onUpdateList}
                  onDeleteList={onDeleteList}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={onDeleteCard}
                  setModalContent={setGlobalModalContent}
                  setShowModal={setGlobalShowModal}
                />
              ))}
            {provided.placeholder}

            {isAddingList ? (
              <div className="w-72 bg-gray-200 rounded-lg p-3 flex-shrink-0 shadow-md">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onBlur={handleAddList}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                  className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-400 focus:border-blue-400 mb-2"
                  placeholder="Enter list title..."
                  autoFocus
                />
                <button
                  onClick={handleAddList}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                >
                  Add List
                </button>
                <button
                  onClick={() => setIsAddingList(false)}
                  className="w-full mt-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors shadow-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-72 bg-black bg-opacity-10 text-white rounded-lg p-3 flex-shrink-0 shadow-md hover:bg-opacity-20 transition-colors flex items-center justify-center space-x-2"
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
                <span>Add another list</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
