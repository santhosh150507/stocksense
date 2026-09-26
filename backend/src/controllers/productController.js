const Product = require('../models/Product');
const Category = require('../models/Category');
const StockLevel = require('../models/StockLevel');

const productController = {
  /**
   * List all products with optional search and category filter
   */
  async getAllProducts(req, res, next) {
    try {
      const { search, category_id, limit, offset } = req.query;
      const products = await Product.findAll({
        search,
        category_id: category_id ? parseInt(category_id, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0
      });
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single product by ID with stock breakdown by location
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      const locationsStock = await StockLevel.findByProduct(id);
      return res.status(200).json({
        ...product,
        stock_by_location: locationsStock
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single product by SKU
   */
  async getProductBySku(req, res, next) {
    try {
      const { sku } = req.params;
      const product = await Product.findBySku(sku);
      if (!product) {
        return res.status(404).json({ error: 'Product with this SKU not found.' });
      }
      const locationsStock = await StockLevel.findByProduct(product.id);
      return res.status(200).json({
        ...product,
        stock_by_location: locationsStock
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new product
   */
  async createProduct(req, res, next) {
    try {
      const { sku, name, description, category_id, price, reorder_point } = req.body;

      if (!sku || !name) {
        return res.status(400).json({ error: 'SKU and product name are required.' });
      }

      const existing = await Product.findBySku(sku.trim());
      if (existing) {
        return res.status(400).json({ error: 'A product with this SKU already exists.' });
      }

      const newProduct = await Product.create({
        sku: sku.trim(),
        name: name.trim(),
        description,
        category_id: category_id ? parseInt(category_id, 10) : null,
        price: price ? parseFloat(price) : 0.0,
        reorder_point: reorder_point ? parseInt(reorder_point, 10) : 10
      });

      return res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { sku, name, description, category_id, price, reorder_point } = req.body;

      const existing = await Product.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      if (sku && sku !== existing.sku) {
        const skuTaken = await Product.findBySku(sku.trim());
        if (skuTaken && skuTaken.id !== parseInt(id, 10)) {
          return res.status(400).json({ error: 'Another product with this SKU already exists.' });
        }
      }

      const updated = await Product.update(id, {
        sku: sku ? sku.trim() : undefined,
        name: name ? name.trim() : undefined,
        description,
        category_id: category_id !== undefined ? (category_id ? parseInt(category_id, 10) : null) : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        reorder_point: reorder_point !== undefined ? parseInt(reorder_point, 10) : undefined
      });

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await Product.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      await Product.delete(id);
      return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * List all categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new category
   */
  async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Category name is required.' });
      }

      const category = await Category.create({ name: name.trim(), description });
      return res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
