import cors from '@fastify/cors';
import Fastify from 'fastify';
import { createServer } from 'http';
import { Server } from 'socket.io';

const fastify = Fastify();
await fastify.register(cors, {
  // everything
});

// test a hello world on /
fastify.get('/', async (request, reply) => {
  return 'hello world';
});

const httpServer = createServer(fastify);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // autoriser toutes les origines
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

// empty board with 625 pixels of white color
let board = new Array(625).fill('#ffdfff');

let userClickData = new Map();

io.on('connection', (socket) => {
  const clientIp = socket.handshake.address;

  socket.emit('init', board);

  socket.on('pixel change', (data) => {
    if (canUserClick(clientIp, data.userAgent)) {
      board[data.pixelIndex] = data.color;
      userClickData.set(clientIp + data.userAgent, new Date());
      io.emit('pixel change', data);
    }
  });
});

httpServer.listen(3044, () => {
  console.log('listening on *:3044');
});

function canUserClick(ip, userAgent) {
  const lastClickDate = userClickData.get(ip + userAgent);
  if (lastClickDate && new Date() - lastClickDate < 5000) {
    return false;
  }
  return true;
}
