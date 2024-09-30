import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

const frontendUrl = process.env.FRONTEND_URL;

// CORSミドルウェアの設定
app.use(
  cors({
    origin: frontendUrl, // フロントエンドがホストされているオリジンを指定
    methods: ['GET', 'POST', 'DELETE'], // 許可するHTTPメソッド
    allowedHeaders: ['Content-Type'], // 許可するHTTPヘッダー
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React のフロントエンドのURL
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req: Request, res: Response) => {
  res.send('Socket.io server is running');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // クライアントからメッセージを受け取ったときの処理
  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    // 受け取ったメッセージを全てのクライアントに送信
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
