export const statusCodes = {
  200: 'ok',
  201: 'created',
  204: 'no-content',
  304: 'not-modified',
  400: 'bad-request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not-found',
  409: 'conflict',
  422: 'unprocessable-entity',
  500: 'server-error',
};

export const getStatusLabel = (code: number, defaultCode = 200) => {
  return statusCodes[code] || defaultCode;
};
