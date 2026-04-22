const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/auth.model');
require('dotenv').config();

class AuthController {
  static async signup(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: 'Debes enviar un body en formato JSON'
        });
      }

      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          message: 'username, email y password son obligatorios'
        });
      }

      const existingUser = await AuthModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          message: 'El correo ya está registrado'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await AuthModel.createUser({
        username,
        email,
        passwordHash,
        role: role || 'client'
      });

      return res.status(201).json({
        message: 'Usuario creado correctamente',
        user
      });
    } catch (error) {
      console.error('Error en signup:', error);
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: 'Debes enviar un body en formato JSON'
        });
      }

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'email y password son obligatorios'
        });
      }

      const user = await AuthModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({
          message: 'Credenciales inválidas'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Credenciales inválidas'
        });
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.status(200).json({
        message: 'Login exitoso',
        token
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        message: 'Error interno',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;