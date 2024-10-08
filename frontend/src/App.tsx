import React from 'react';
import { io, Socket } from 'socket.io-client';

// Socket.io サーバーの URL を指定
const socket: Socket = io('http://localhost:4000', {
  auth: {
    nickname: 'macos',
    device: 'client',
  },
});

const App: React.FC = () => {
  const [connectedRaspberryPi, setConnectedRaspberryPi] = React.useState<
    'unknown' | 'connected' | 'disconnected'
  >('unknown');
  const [message, setMessage] = React.useState<string>('');
  const [chat, setChat] = React.useState<string[]>([]);

  React.useEffect(() => {
    // サーバーからメッセージを受信
    socket.on('message', (msg) => {
      if (msg.type === 'control') {
        setConnectedRaspberryPi(msg.control.connectedRaspberryPi ? 'connected' : 'disconnected');
      }
      if (msg.type === 'message') {
        setChat((prevChat) => [...prevChat, msg.message]);
      }
    });
    socket.on('', (msg: string) => {
      console.log(msg);
      setChat((prevChat) => [...prevChat, msg]);
    });

    // コンポーネントがアンマウントされたときにソケット接続を切断
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    // サーバーにメッセージを送信
    socket.emit('message', message);
    setMessage(''); // メッセージを送信後に入力欄をクリア
  };

  return (
    <div className="App">
      <h1>Chat Application</h1>

      <div>
        <div>{connectedRaspberryPi}</div>
      </div>
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Chat Messages</h2>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
