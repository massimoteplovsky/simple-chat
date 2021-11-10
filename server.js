const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const PORT = 3001;
const rooms = new Map();

app.use(express.json());

app.get('/rooms', (req, res) => {
  return res.json(rooms);
});

app.post('/rooms', (req, res) => {
  const { username, roomId } = req.body;

  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }

  return res.sendStatus(200);
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, username }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, username);
    const users = [...rooms.get(roomId).get('users').values()];
    const messages = [...rooms.get(roomId).get('messages')];
    io.to(roomId).emit('ROOM:SET_DATA', { users, messages });
  });

  socket.on('ROOM:NEW_MESSAGE', ({ username, roomId, text }) => {
    if (!rooms.has(roomId)) return;

    rooms.get(roomId).get('messages').push({ text, username });
    const messages = [...rooms.get(roomId).get('messages')];
    console.log('new messages', messages);
    io.to(roomId).emit('ROOM:SET_NEW_MESSAGES', messages);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        const messages = [...value.get('messages')];
        io.to(roomId).emit('ROOM:SET_DATA', { users, messages });
      }
    });
  });
  console.log(`Socket connected with id: ${socket.id}`);
});

server.listen(PORT, (err) => {
  if (err) {
    console.log('Error occured');
    return process.exit(1);
  }
  console.log(`Server is running on port ${PORT}`);
});
