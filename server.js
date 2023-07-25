import cors from '@fastify/cors';
import Fastify from 'fastify';
import { createServer } from 'http';
import { Server } from 'socket.io';

const fastify = Fastify();

const corsParam = {
  origin: 'http://localhost:5173', // melvyn origin: 'https://rplacejs.vercel.app/',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

await fastify.register(cors, corsParam);

// test a hello world on /
fastify.get('/', async (req, res) => {
  return 'hello world';
});

const httpServer = createServer(fastify);
const io = new Server(httpServer, corsParam);

// empty board with 625 pixels of white color
let board = new Array(625).fill('#fed734');
const allowedColors = [
  '#ff4500',
  '#00cc78',
  '#2450a5',
  '#821f9f',
  '#fed734',
  '#f9fafc',
  '#000000',
];

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
  const clientIp = getIp(socket);
  const socketId = socket.id;

  socket.emit('init', board);

  socket.on('pixel change', (data) => {
    if (!allowedColors.includes(data.color)) {
      return;
    }

    const clientUserAgent = socket.handshake.headers['user-agent']?.trim();
    if (!clientUserAgent) {
      return;
    }

    if (canUserClick(clientIp, socketId, clientUserAgent)) {
      board[data.pixelIndex] = data.color;
      userClickData.delete(socketId);
      userClickData.set(socketId, {
        date: new Date(),
        ip: clientIp,
        userAgent: clientUserAgent,
      });
      io.emit('pixel change', data);
    } else {
      console.log('user not allowed to click');
    }
  });

  socket.on('disconnect', () => {
    userClickData.delete(socketId);
    console.log(socketId + ' disconnected');
  });
});

io.on('error', (err) => {
  console.log('received error from io:', err);
});

const port = process.env.PORT ?? 3044;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});

function canUserClick(ip, socketId, userAgent) {
  const mapData = userClickData.get(socketId);

  // check if a userclickdata have the same ip but not the same socketId
  for (const [key, value] of userClickData.entries()) {
    if (key !== socketId && value.ip === ip) {
      if (value.date && new Date() - value.date < 5000) {
        return false;
      }
    }
  }
  if (!mapData) {
    return true;
  }

  if (mapData && (mapData.ip !== ip || mapData.userAgent !== userAgent)) {
    return false;
  } else if (mapData.date && new Date() - mapData.date < 5000) {
    return false;
  }

  return true;
}

function getIp(socket) {
  const headers = socket.handshake.headers;
  const xforwardedFor = headers['x-forwarded-for'];
  if (xforwardedFor) {
    const forwards = xforwardedFor.split(',').map((ip) => ip.trim());
    return forwards[0];
  }
  return socket.handshake.address;
}
