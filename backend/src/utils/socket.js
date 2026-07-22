const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

module.exports = {
  init: (server) => {
    io = socketio(server, {
      cors: {
        origin: '*', // Adjust this for production security
        methods: ['GET', 'POST']
      }
    });

    // Socket Authentication Middleware
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
      } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  // Utility for emitting notifications
  sendNotification: (event, data) => {
    if (io) {
      io.emit(event, data);
    }
  }
};
