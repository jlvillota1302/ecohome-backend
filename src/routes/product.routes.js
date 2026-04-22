const express = require('express');
const ProductController = require('../controllers/product.controller');
const authJWT = require('../middlewares/authJWT');
const authorizeRole = require('../middlewares/authorizeRole');

const router = express.Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

router.post('/', authJWT, authorizeRole('admin'), ProductController.create);
router.put('/:id', authJWT, authorizeRole('admin'), ProductController.update);
router.patch('/:id', authJWT, authorizeRole('admin'), ProductController.update);
router.delete('/:id', authJWT, authorizeRole('admin'), ProductController.remove);

module.exports = router;