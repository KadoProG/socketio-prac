import socketio

# Socket.IO クライアントを作成
sio = socketio.Client()

# サーバーに接続されたときのイベントハンドラ
@sio.event
def connect():
    print('Connected to server')

# サーバーからメッセージを受け取ったときのイベントハンドラ
@sio.event
def message(data):
    print('Received message:', data)

# サーバーとの接続が切断されたときのイベントハンドラ
@sio.event
def disconnect():
    print('Disconnected from server')

# サーバーに接続
sio.connect('http://localhost:4000')

# サーバーにメッセージを送信
sio.send('Hello from Python client!')

# メッセージ受信を保持
sio.wait()
