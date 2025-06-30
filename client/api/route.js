const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;
const UPDATE_LIST_ORDER = 'update-order/multiple';

export const API = {
  boards: {
    route: `${BASE_URL}/boards`,
  },
  lists: {
    route: `${BASE_URL}/lists`,
    route_multiple: `${BASE_URL}/lists/${UPDATE_LIST_ORDER}`,
  },
  cards: {
    route: `${BASE_URL}/cards`,
    route_multiple: `${BASE_URL}/cards/${UPDATE_LIST_ORDER}`,
  },
};
