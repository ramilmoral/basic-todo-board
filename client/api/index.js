import { API } from './route';
import { API_ENUMS } from '@/enums/api.enums';
import { throwErrorHandler } from './error.handler';
import { options } from './headers';

export const getBoards = async () => {
  const response = await fetch(`${API.boards.route}`);
  if (!response.ok) throwErrorHandler(API_ENUMS.boards.error_fetch_all);
  return response.json();
};

export const createBoard = async (title) => {
  const response = await fetch(`${API.boards.route}`, {
    ...options('POST'),
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throwErrorHandler(API_ENUMS.boards.error_create);
  return response.json();
};

export const getBoardById = async (boardId) => {
  const response = await fetch(`${API.boards.route}/${boardId}`);
  if (!response.ok) throwErrorHandler(API_ENUMS.boards.error_fetch);
  return response.json();
};

export const deleteBoard = async (boardId) => {
  const response = await fetch(
    `${API.boards.route}/${boardId}`,
    options('DELETE')
  );
  if (!response.ok) throwErrorHandler(API_ENUMS.boards.error_delete);
  return response.json();
};

// --- Lists ---
export const getListsByBoard = async (boardId) => {
  const response = await fetch(`${API.lists.route}/${boardId}`);
  if (!response.ok) throwErrorHandler(API_ENUMS.lists.error_fetch);
  return response.json();
};

export const createList = async (title, boardId, order) => {
  const response = await fetch(`${API.lists.route}`, {
    ...options('POST'),
    body: JSON.stringify({ title, boardId, order }),
  });
  if (!response.ok) throwErrorHandler(API_ENUMS.lists.error_create);
  return response.json();
};

export const updateList = async (listId, data) => {
  const response = await fetch(`${API.lists.route}/${listId}`, {
    ...options('PUT'),
    body: JSON.stringify(data),
  });
  if (!response.ok) throwErrorHandler(API_ENUMS.lists.error_update);
  return response.json();
};

export const updateListOrder = async (listUpdates) => {
  const response = await fetch(`${API.lists.route_multiple}`, {
    ...options('PUT'),
    body: JSON.stringify(listUpdates),
  });
  if (!response.ok) throwErrorHandler(API_ENUMS.lists.error_update_order);
  return response.json();
};

export const deleteList = async (listId) => {
  const response = await fetch(
    `${API.lists.route}/${listId}`,
    options('DELETE')
  );
  if (!response.ok) throwErrorHandler(API_ENUMS.lists.error_delete);
  return response.json();
};

// --- Cards ---
export const getCardsByList = async (listId) => {
  const response = await fetch(`${API.cards.route}/${listId}`);
  if (!response.ok) throwErrorHandler(API_ENUMS.cards.error_fetch);
  return response.json();
};

export const createCard = async (title, description, listId, order) => {
  const response = await fetch(`${API.cards.route}`, {
    ...options('POST'),
    body: JSON.stringify({ title, description, listId, order }),
  });
  if (!response.ok) throwErrorHandler(API_ENUMS.cards.error_create);
  return response.json();
};

export const updateCard = async (cardId, data) => {
  const response = await fetch(`${API.cards.route}/${cardId}`, {
    ...options('PUT'),
    body: JSON.stringify(data),
  });
  if (!response.ok) throwErrorHandler(API_ENUMS.cards.error_update);
  return response.json();
};

export const updateCardOrderAndList = async (cardUpdates) => {
  const response = await fetch(`${API.cards.route_multiple}`, {
    ...options('PUT'),
    body: JSON.stringify(cardUpdates),
  });
  if (!response.ok) throwErrorHandler(API_ENUMS.cards.error_update_order);
  return response.json();
};

export const deleteCard = async (cardId) => {
  const response = await fetch(
    `${API.cards.route}/${cardId}`,
    options('DELETE')
  );
  if (!response.ok) throwErrorHandler(API_ENUMS.cards.error_delete);
  return response.json();
};
