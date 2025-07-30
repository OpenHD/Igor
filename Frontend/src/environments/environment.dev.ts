export const environment = {
  production: false,
  apiUrl: `http://localhost:${process.env?.['BACKEND_PORT'] || '8080'}`
};