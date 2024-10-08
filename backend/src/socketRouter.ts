import { Socket } from 'socket.io';
import { io } from './main';

interface ClientStatus {
  id: string;
  nickname: string;
  device: 'client' | 'raspberrypi';
}

const clients: Set<ClientStatus> = new Set();

const isConnectedRaspberryPi = () =>
  Array.from(clients).some((client) => client.device === 'raspberrypi');

export const socketRouter = (socket: Socket) => {
  const urlParams = socket.handshake.auth;
  const nickname = urlParams.nickname;
  const device = urlParams.device;

  if (
    !nickname ||
    typeof nickname !== 'string' ||
    !device ||
    typeof device !== 'string' ||
    (device !== 'client' && device !== 'raspberrypi')
  ) {
    console.log('Invalid nickname or device');
    socket.emit('error', 'Invalid nickname or device');
    socket.disconnect();
    return;
  }

  const client: ClientStatus = {
    id: socket.id,
    nickname,
    device,
  };

  clients.add(client);

  // ラズベリーパイが接続している場合は、クライアントにメッセージを送信
  const message = {
    type: 'control',
    control: {
      connectedRaspberryPi: isConnectedRaspberryPi(),
    },
  };

  io.to(socket.id).emit('message', message);

  // クライアントからメッセージを受け取ったときの処理
  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    // 受け取ったメッセージを全てのクライアントに送信
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    clients.delete(client);
  });
};
