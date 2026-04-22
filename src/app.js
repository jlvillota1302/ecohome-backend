const express = require('express');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const registerChatSocket = require('./sockets/chat.socket');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Servidor EcoHome funcionando');
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

registerChatSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});