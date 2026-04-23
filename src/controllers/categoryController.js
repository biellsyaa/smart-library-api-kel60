import { CategoryModel } from '../models/categoryModel.js';

export const CategoryController = {

  // GET ALL + SEARCH
  async getCategories(req, res) {
    try {
      const { name } = req.query;

      let categories;

      if (name) {
        categories = await CategoryModel.searchByName(name);
      } else {
        categories = await CategoryModel.getAll();
      }

      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET BY ID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryModel.getById(id);
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // CREATE
  async addCategory(req, res) {
    try {
      const category = await CategoryModel.create(req.body.name);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // UPDATE
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updated = await CategoryModel.update(id, name);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await CategoryModel.delete(id);
      res.json({ message: "Category deleted" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

};