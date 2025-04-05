// utils/websocket.js
const { Server } = require('socket.io');

const setupWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow frontend to connect
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Broadcast time updates every minute
    const timer = setInterval(() => {
      const timeRemaining = calculateTimeRemaining(); // Implement this function
      io.emit('time', timeRemaining); // Broadcast to all clients
    }, 60000);

    // Handle draw results
    const drawResults = calculateDrawResults(); // Implement this function
    io.emit('draw', drawResults); // Broadcast to all clients

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clearInterval(timer);
    });
  });

  return io;
};

module.exports = setupWebSocket;