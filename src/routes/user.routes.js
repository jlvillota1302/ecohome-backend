const express = require('express');
const authJWT = require('../middlewares/authJWT');
const UserController = require('../controllers/user.controllers');

const router = express.Router();

router.get('/me/stats', authJWT, UserController.getMyStats);

module.exports = router;