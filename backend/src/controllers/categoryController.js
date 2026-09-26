const Category = require('../models/Category');

const categoryController = {
  async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Category name is required.' });
      }

      const category = await Category.create({ name, description });
      return res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const category = await Category.update(id, { name, description });
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.delete(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      return res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
