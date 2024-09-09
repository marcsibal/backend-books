import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import BooksModel from '../models/books.js';
import app from '../app.js';

describe('Books Controller', function () {
  this.timeout(15000); // Increased timeout for tests

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/1.0.0/books.json', () => {
    it('should return 200 and a list of books if books are found', async () => {
      const booksMock = [
        { id: 1, title: 'Book 1', author: 'Author 1', isbn: '1111', published_date: 1725763200, genre: 'Fiction' },
        { id: 2, title: 'Book 2', author: 'Author 2', isbn: '2222', published_date: 1725763200, genre: 'Non-fiction' },
      ];
      sinon.stub(BooksModel, 'search').resolves(booksMock);

      const res = await request(app).get('/api/1.0.0/books.json').query({ from: '1725763200', to: '1730000000' });
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an('array').that.has.length(2);
    });

    it('should return 404 if no books are found', async () => {
      sinon.stub(BooksModel, 'search').resolves([]);

      const res = await request(app).get('/api/1.0.0/books.json').query({ from: '1725763200', to: '1730000000' });
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('No books found matching the search criteria.');
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      sinon.stub(BooksModel, 'search').throws(error);

      const res = await request(app).get('/api/1.0.0/books.json').query({ from: '1725763200', to: '1730000000' }).catch(err => err.response);

      expect(res.status).to.equal(500);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('An error occurred while retrieving books.');
    });
  });

  describe('POST /api/1.0.0/books.json', () => {
    it('should add a new book and return 200', async () => {
      const newBook = {id: 100, title: 'Book 3', author: 'Author 3', isbn: '3333', published_date: 1725763200, genre: 'Fantasy' };
      sinon.stub(BooksModel, 'insert').resolves([{ id: 1, ...newBook }]); // Simulate successful insertion

      const res = await request(app).post('/api/1.0.0/books.json').send(newBook);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal('Book added successfully.');
    });

    it('should return 400 if adding a book fails', async () => {
      const newBook = { title: 'Book 4', author: 'Author 4', isbn: '4444', published_date: 1725763200, genre: 'Sci-Fi' };
      sinon.stub(BooksModel, 'insert').resolves([]); // Simulate failure

      const res = await request(app).post('/api/1.0.0/books.json').send(newBook);
      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('Failed to add book.');
    });

    it('should return 500 on error', async () => {
      const newBook = { title: 'Book 5', author: 'Author 5', isbn: '5555', published_date: 1725763200, genre: 'Thriller' };
      sinon.stub(BooksModel, 'insert').throws(new Error('Database error'));

      const res = await request(app).post('/api/1.0.0/books.json').send(newBook).catch(err => err.response);

      expect(res.status).to.equal(500);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('An error occurred while adding the book.');
    });
  });


  describe('PUT /api/1.0.0/books.json', () => {
    it('should update a book and return 200', async () => {
      const updatedBook = { id: 1, title: 'Updated Book', author: 'Updated Author', isbn: '6666', published_date: 1725763200, genre: 'Updated Genre' };
      sinon.stub(BooksModel, 'update').resolves([updatedBook]);

      const res = await request(app).put('/api/1.0.0/books.json').send(updatedBook);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.deep.equal([updatedBook]);
      expect(res.body.message).to.equal('Book updated successfully.'); // Update message expectation
    });

    it('should return 404 if updating a book fails', async () => {
      const updatedBook = { id: 2, title: 'Non-existent Book', author: 'Non-existent Author', isbn: '7777', published_date: 1725763200, genre: 'Unknown Genre' };
      sinon.stub(BooksModel, 'update').resolves([]);

      const res = await request(app).put('/api/1.0.0/books.json').send(updatedBook);
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('Book not found or update failed.');
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      sinon.stub(BooksModel, 'update').throws(error);

      const res = await request(app).put('/api/1.0.0/books.json').send({ id: 3, title: 'Error Book', author: 'Error Author', isbn: '8888', published_date: 1725763200, genre: 'Error Genre' }).catch(err => err.response);

      expect(res.status).to.equal(500);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('An error occurred while updating the book.');
    });
  });


  describe('DELETE /api/1.0.0/books.json', () => {
    it('should delete a book and return 200', async () => {
      const bookId = 1;
      sinon.stub(BooksModel, 'delete').resolves([{ id: bookId }]);

      const res = await request(app).delete('/api/1.0.0/books.json').query({ id: bookId });
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.deep.equal([{ id: bookId }]);
      expect(res.body.message).to.equal('Book deleted successfully.');
    });

    it('should return 404 if no book is found to delete', async () => {
      const bookId = 2;
      sinon.stub(BooksModel, 'delete').resolves([]);

      const res = await request(app).delete('/api/1.0.0/books.json').query({ id: bookId });
      expect(res.status).to.equal(404);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('Book not found or deletion failed.');
    });

    it('should return 500 on error', async () => {
      const error = new Error('Database error');
      sinon.stub(BooksModel, 'delete').throws(error);

      const res = await request(app).delete('/api/1.0.0/books.json').query({ id: 3 }).catch(err => err.response);

      expect(res.status).to.equal(500);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.equal('An error occurred while deleting the book.');
    });
  });
});
