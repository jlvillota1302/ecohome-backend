const ProductModel = require('../models/product.model');

class ProductController {
  static async getAll(req, res) {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById(id);

      if (!product) {
        return res.status(404).json({
          message: 'Producto no encontrado'
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const { name, price } = req.body;

      if (!name || price === undefined) {
        return res.status(400).json({
          message: 'name y price son obligatorios'
        });
      }

      if (isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({
          message: 'price debe ser numérico y mayor que 0'
        });
      }

      const newProduct = await ProductModel.create({
        name,
        price: Number(price),
        created_by: req.user.id
      });

      return res.status(201).json(newProduct);
    } catch (error) {
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;

      if (!name || price === undefined) {
        return res.status(400).json({
          message: 'name y price son obligatorios'
        });
      }

      if (isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({
          message: 'price debe ser numérico y mayor que 0'
        });
      }

      const updatedProduct = await ProductModel.update(id, {
        name,
        price: Number(price)
      });

      if (!updatedProduct) {
        return res.status(404).json({
          message: 'Producto no encontrado'
        });
      }

      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }

  static async remove(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductModel.remove(id);

      if (!deletedProduct) {
        return res.status(404).json({
          message: 'Producto no encontrado'
        });
      }

      return res.status(200).json({
        message: 'Producto eliminado correctamente',
        product: deletedProduct
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }
}

module.exports = ProductController;