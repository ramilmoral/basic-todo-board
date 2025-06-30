const headers = { 'Content-Type': 'application/json' };

export const options = (_methods) => {
  switch (_methods) {
    case 'POST':
      return {
        method: 'POST',
        headers: headers,
      };
      break;
    case 'PUT':
      return {
        method: 'PUT',
        headers: headers,
      };
      break;
    case 'DELETE':
      return {
        method: 'DELETE',
      };
      break;
    default:
      method: 'GET', headers;
  }
};
