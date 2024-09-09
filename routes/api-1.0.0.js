import BooksController from '../controllers/books.js';

const setupRoutes = (app) => {
  app.get('/api/1.0.0/books.json', BooksController.get);
  app.post('/api/1.0.0/books.json', BooksController.add);
  app.delete('/api/1.0.0/books.json', BooksController.delete);
  app.put('/api/1.0.0/books.json', BooksController.update);
};

export default setupRoutes;
