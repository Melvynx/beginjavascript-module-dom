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
let board = new Array(625).fill('#ff4500');

let userClickData = new Map();

const COLORS = [
  '#ff4500',
  '#00cc78',
  '#2450a5',
  '#821f9f',
  '#fed734',
  '#f9fafc',
  '#000000',
];

io.on('connection', (socket) => {
  const socketId = socket.id;
  const clientIp = socket.handshake.address;

  socket.emit('init', board);

  socket.on('pixel change', (data) => {
    if (!COLORS.includes(data.color)) {
      return;
    }
    if (canUserClick(clientIp, socketId)) {
      board[data.pixelIndex] = data.color;
      userClickData.set(clientIp + socketId, new Date());
      io.emit('pixel change', data);
    }
  });
});

const port = process.env.PORT ?? 3044;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});

function canUserClick(ip, socketId) {
  const lastClickDate = userClickData.get(ip + socketId);
  if (lastClickDate && new Date() - lastClickDate < 3000) {
    return false;
  }
  return true;
}
