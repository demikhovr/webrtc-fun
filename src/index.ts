import * as express from 'express';
import { Application } from 'express';
import * as socketIO from 'socket.io';
import { Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import * as Jimp from 'jimp';
import * as path from 'path';

const app: Application = express();
const httpServer: HTTPServer = createServer(app);
const io: SocketIOServer = socketIO(httpServer);
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  socket.on('image', async (data) => {
    const buffer = Buffer.from(data.image.replace(/^data:image\/png;base64,/, ''), 'base64');
    const image = await Jimp.read(buffer);
    const updatedImage = await image
      .invert()
      .getBase64Async(Jimp.MIME_JPEG);
    socket.emit('image', {
      image: updatedImage,
    });
  });
});

httpServer.listen(DEFAULT_PORT, () => {
  console.log(`Server is listening on http://localhost:${DEFAULT_PORT}`);
});
