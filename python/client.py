import socketio
import pygame
import sys
import threading


# 初期化
pygame.init()
screen = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()


# Socket.IO クライアントを作成
sio = socketio.Client()


# サーバーに接続されたときのイベントハンドラ
@sio.event
def connect():
    print("Connected to server")


# サーバーからメッセージを受け取ったときのイベントハンドラ
@sio.event
def message(data):
    print("Received message:", data)


# サーバーとの接続が切断されたときのイベントハンドラ
@sio.event
def disconnect():
    print("Disconnected from server")


# サーバーに接続
params = {"device": "raspberrypi", "nickname": "Python Client"}
sio.connect("http://localhost:4000", auth=params)

# サーバーにメッセージを送信
sio.send("Hello from Python client!")

# サーバーからのメッセージを待ち受けるスレッドを開始
wait_thread = threading.Thread(target=sio.wait)
wait_thread.start()

# 色の定義
WHITE = (255, 255, 255)
RED = (255, 0, 0)

while True:
    for event in pygame.event.get():
        print(event)
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_p:  # "P"キーで中断・再開を切り替え
                sio.send("Hello from Python client!")

    # 画面を塗りつぶし
    screen.fill(WHITE)

    # 画面の更新
    pygame.display.flip()
    clock.tick(60)  # 60 FPSを目指す！
