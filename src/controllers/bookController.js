import { BookModel } from '../models/bookModel.js';

export const BookController = {

  // GET ALL + SEARCH
  async getAllBooks(req, res) {
    try {
      const { title } = req.query;

      let books;

      if (title) {
        books = await BookModel.searchByTitle(title);
      } else {
        books = await BookModel.getAll();
      }

      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET BY ID
  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await BookModel.getById(id);
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // CREATE
  async createBook(req, res) {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // UPDATE
  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const updated = await BookModel.update(id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE
  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      await BookModel.delete(id);
      res.json({ message: "Book deleted" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

};