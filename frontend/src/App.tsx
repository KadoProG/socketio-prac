import { Button } from '@/components/Button';
import React from 'react';
import { io, Socket } from 'socket.io-client';

const socketioUrl = import.meta.env.VITE_SOCKETIO_URL;

// Socket.io サーバーの URL を指定
const socket: Socket = io(socketioUrl, {
  auth: {
    nickname: 'macos',
    device: 'client',
  },
});

export const App: React.FC = () => {
  const [connectedRaspberryPi, setConnectedRaspberryPi] = React.useState<
    'unknown' | 'connected' | 'disconnected'
  >('unknown');
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    // サーバーからメッセージを受信
    socket.on('message', (msg) => {
      if (msg.type === 'config') {
        setConnectedRaspberryPi(msg.config?.connectedRaspberryPi ? 'connected' : 'disconnected');
      }
      if (msg.type === 'alert') {
        if (confirm(msg.alert)) {
          // OK ボタンが押されたときの処理
          socket.emit('message', { type: 'control', control: 'start' });
        }
      }
    });

    // コンポーネントがアンマウントされたときにソケット接続を切断
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // サーバーにメッセージを送信
      console.log(message);
      socket.emit('message', { type: 'control', control: message });
      setMessage(''); // メッセージを送信後に入力欄をクリア
    },
    [message]
  );

  const startClick = React.useCallback(() => {
    // サーバーにメッセージを送信
    socket.emit('message', { type: 'control', control: 'start' });
  }, []);

  const angleClick = React.useCallback(() => {
    // サーバーにメッセージを送信
    socket.emit('message', { type: 'control', control: 'angle' });
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 10,
          textAlign: 'center',
        }}
      >
        <h1>砂時計App</h1>

        <div>
          <div>{connectedRaspberryPi}</div>
        </div>
        <Button onClick={startClick}>スタート/ストップ</Button>
        <Button onClick={angleClick}>角度変更</Button>
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button>Send</button>
      </form>
    </div>
  );
};
