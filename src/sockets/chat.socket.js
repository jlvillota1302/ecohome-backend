const jwt = require('jsonwebtoken');
const MessageModel = require('../models/message.model');
require('dotenv').config();

function registerChatSocket(io) {
  function extractToken(socket) {
    const authToken = socket.handshake.auth?.token;
    if (authToken) return authToken;

    const queryToken = socket.handshake.query?.token;
    if (typeof queryToken === 'string' && queryToken.trim()) return queryToken.trim();

    const authHeader =
      socket.handshake.headers?.authorization ||
      socket.handshake.headers?.Authorization;

    if (typeof authHeader === 'string' && authHeader.trim()) {
      const [type, value] = authHeader.split(' ');
      if (type?.toLowerCase() === 'bearer' && value?.trim()) return value.trim();
      return authHeader.trim();
    }

    return null;
  }

  io.use((socket, next) => {
    try {
      const token = extractToken(socket);
      if (!token) return next();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        username: decoded.username || decoded.email
      };

      return next();
    } catch (error) {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', async (socket) => {
    const username = socket.user?.username || 'anónimo';
    console.log(`Usuario conectado: ${username}`);

    try {
      const lastMessages = await MessageModel.getLast10();
      socket.emit('messages', lastMessages);
    } catch (error) {
      console.error('Error cargando historial:', error.message);
    }

    socket.on('new-message', async (payload, ack) => {
      try {
        if (!socket.user?.id) {
          if (typeof ack === 'function') ack({ ok: false, error: 'No autenticado' });
          return;
        }
        if (!payload?.text || !payload.text.trim()) return;

        const savedMessage = await MessageModel.create({
          user_id: socket.user.id,
          username: socket.user.username,
          text: payload.text.trim()
        });

        io.emit('new-message', savedMessage);
        if (typeof ack === 'function') ack({ ok: true, message: savedMessage });
      } catch (error) {
        console.error('Error guardando mensaje:', error.message);
        if (typeof ack === 'function') ack({ ok: false, error: 'Error guardando mensaje' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${username}`);
    });
  });
}

module.exports = registerChatSocket;