import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {

  async getAuthors(req, res) {
    try {
        const { name } = req.query;
        
        let authors;

        if (name) {
            authors = await AuthorModel.searchByName(name);
        } else {
            authors = await AuthorModel.getAll();
        }

        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
},

  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }, // ✅ INI YANG TADI KURANG

  // GET by ID
  async getAuthorById(req, res) {
    try {
      const { id } = req.params;
      const author = await AuthorModel.getById(id);
      res.json(author);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE
  async updateAuthor(req, res) {
    try {
      const { id } = req.params;
      const { name, nationality } = req.body;
      const updated = await AuthorModel.update(id, name, nationality);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE
  async deleteAuthor(req, res) {
    try {
      const { id } = req.params;
      await AuthorModel.delete(id);
      res.json({ message: "Author deleted" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

};