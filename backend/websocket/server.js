const { Server } = require('socket.io');

class WebSocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
      }
    });
    
    this.setupHandlers();
    this.startDataStream();
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      socket.on('subscribe', (channel) => {
        socket.join(channel);
      });
      
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  startDataStream() {
    setInterval(() => {
      const data = {
        timestamp: new Date().toISOString(),
        activeProfiles: Math.floor(Math.random() * 1000) + 500,
        newAlerts: Math.floor(Math.random() * 10),
        systemLoad: Math.random() * 100
      };
      
      this.io.to('dashboard').emit('realtime-data', data);
    }, 2000);
  }
}

module.exports = WebSocketServer;