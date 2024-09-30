import React from 'react';
import { io, Socket } from 'socket.io-client';

// Socket.io サーバーの URL を指定
const socket: Socket = io('http://localhost:4000');

const App: React.FC = () => {
  const [message, setMessage] = React.useState<string>('');
  const [chat, setChat] = React.useState<string[]>([]);

  React.useEffect(() => {
    // サーバーからメッセージを受信
    socket.on('message', (msg: string) => {
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
