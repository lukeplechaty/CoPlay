import Express from 'express';
import { createServer as CreateServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const App = Express();
const HttpServer = CreateServer(App);

const Io = new SocketIOServer(HttpServer, {
  cors: {
    origin: '*',
  },
});

App.get('/', (Request, Response) => {
  Response.send('Socket.IO server running');
});

Io.on('connection', (Socket) => {
  console.log('A user connected:', Socket.id);

  Socket.on('disconnect', () => {
    console.log('User disconnected:', Socket.id);
  });
});

const Port = process.env.PORT || 8080;
HttpServer.listen(Port, () => {
  console.log(`Server listening on port ${Port}`);
});
