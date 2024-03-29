import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

    this.socket.on('my broadcast', (data) => {
        console.log(data);
    })
  }
}

export default new SocketioService();
