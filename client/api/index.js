const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const getBoards = async () => {
  const response = await fetch(`${API_BASE_URL}/boards`);
  if (!response.ok) throw new Error('Failed to fetch boards');
  return response.json();
};

export const createBoard = async (title) => {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create board');
  return response.json();
};

export const getBoardById = async (boardId) => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardId}`);
  if (!response.ok) throw new Error('Failed to fetch board');
  return response.json();
};

export const deleteBoard = async (boardId) => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete board');
  return response.json();
};

// --- Lists ---
export const getListsByBoard = async (boardId) => {
  const response = await fetch(`${API_BASE_URL}/lists/${boardId}`);
  if (!response.ok) throw new Error('Failed to fetch lists');
  return response.json();
};

export const createList = async (title, boardId, order) => {
  const response = await fetch(`${API_BASE_URL}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, boardId, order }),
  });
  if (!response.ok) throw new Error('Failed to create list');
  return response.json();
};

export const updateList = async (listId, data) => {
  const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update list');
  return response.json();
};

export const updateListOrder = async (listUpdates) => {
  const response = await fetch(`${API_BASE_URL}/lists/update-order/multiple`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listUpdates),
  });
  if (!response.ok) throw new Error('Failed to update list order');
  return response.json();
};

export const deleteList = async (listId) => {
  const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete list');
  return response.json();
};

// --- Cards ---
export const getCardsByList = async (listId) => {
  const response = await fetch(`${API_BASE_URL}/cards/${listId}`);
  if (!response.ok) throw new Error('Failed to fetch cards');
  return response.json();
};

export const createCard = async (title, description, listId, order) => {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, listId, order }),
  });
  if (!response.ok) throw new Error('Failed to create card');
  return response.json();
};

export const updateCard = async (cardId, data) => {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update card');
  return response.json();
};

export const updateCardOrderAndList = async (cardUpdates) => {
  const response = await fetch(`${API_BASE_URL}/cards/update-order/multiple`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardUpdates),
  });
  if (!response.ok) throw new Error('Failed to update card order and list');
  return response.json();
};

export const deleteCard = async (cardId) => {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete card');
  return response.json();
};
