const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

const warehouseController = {
  /**
   * List all warehouses with location counts
   */
  async getAllWarehouses(req, res, next) {
    try {
      const warehouses = await Warehouse.findAll();
      return res.status(200).json(warehouses);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single warehouse by ID including its child locations
   */
  async getWarehouseById(req, res, next) {
    try {
      const { id } = req.params;
      const warehouse = await Warehouse.findById(id);
      if (!warehouse) {
        return res.status(404).json({ error: 'Warehouse not found.' });
      }

      const locations = await Location.findByWarehouseId(id);
      return res.status(200).json({
        ...warehouse,
        locations
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new warehouse
   */
  async createWarehouse(req, res, next) {
    try {
      const { name, location, capacity, active } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Warehouse name is required.' });
      }

      const newWarehouse = await Warehouse.create({
        name: name.trim(),
        location: location ? location.trim() : null,
        capacity: capacity ? parseInt(capacity, 10) : 0,
        active: active !== undefined ? Boolean(active) : true
      });

      return res.status(201).json(newWarehouse);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update warehouse details
   */
  async updateWarehouse(req, res, next) {
    try {
      const { id } = req.params;
      const { name, location, capacity, active } = req.body;

      const existing = await Warehouse.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Warehouse not found.' });
      }

      const updated = await Warehouse.update(id, {
        name: name ? name.trim() : undefined,
        location: location !== undefined ? location.trim() : undefined,
        capacity: capacity !== undefined ? parseInt(capacity, 10) : undefined,
        active: active !== undefined ? Boolean(active) : undefined
      });

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete a warehouse
   */
  async deleteWarehouse(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await Warehouse.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Warehouse not found.' });
      }

      await Warehouse.delete(id);
      return res.status(200).json({ message: 'Warehouse deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * List all locations across all warehouses
   */
  async getAllLocations(req, res, next) {
    try {
      const { warehouse_id } = req.query;
      let locations;
      if (warehouse_id) {
        locations = await Location.findByWarehouseId(parseInt(warehouse_id, 10));
      } else {
        locations = await Location.findAll();
      }
      return res.status(200).json(locations);
    } catch (error) {
      next(error);
    }
  },

  /**
   * List locations for a specific warehouse
   */
  async getWarehouseLocations(req, res, next) {
    try {
      const { warehouseId } = req.params;
      const locations = await Location.findByWarehouseId(parseInt(warehouseId, 10));
      return res.status(200).json(locations);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new location within a warehouse
   */
  async createLocation(req, res, next) {
    try {
      const warehouse_id = req.params.warehouseId || req.body.warehouse_id;
      const { code, name } = req.body;

      if (!warehouse_id || !code) {
        return res.status(400).json({ error: 'warehouse_id and location code are required.' });
      }

      const warehouse = await Warehouse.findById(warehouse_id);
      if (!warehouse) {
        return res.status(404).json({ error: 'Warehouse not found.' });
      }

      const location = await Location.create({
        warehouse_id: parseInt(warehouse_id, 10),
        code: code.trim(),
        name: name ? name.trim() : null
      });

      return res.status(201).json(location);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update location
   */
  async updateLocation(req, res, next) {
    try {
      const { id } = req.params;
      const { warehouse_id, code, name } = req.body;

      const existing = await Location.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Location not found.' });
      }

      const updated = await Location.update(id, {
        warehouse_id: warehouse_id ? parseInt(warehouse_id, 10) : undefined,
        code: code ? code.trim() : undefined,
        name: name !== undefined ? (name ? name.trim() : null) : undefined
      });

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete location
   */
  async deleteLocation(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await Location.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Location not found.' });
      }

      await Location.delete(id);
      return res.status(200).json({ message: 'Location deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = warehouseController;
