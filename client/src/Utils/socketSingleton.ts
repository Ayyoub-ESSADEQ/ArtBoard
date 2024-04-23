import { Socket } from "socket.io-client";

//TODO : This should be refactored
export class SocketSingleton {
  private static instance: SocketSingleton;
  private static socket: Socket;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SocketSingleton();
      return this.instance;
    }

    return this.instance;
  }

  public static init(socket: Socket) {
    this.socket = socket;
  }

  public getSocket() {
    return SocketSingleton.socket;
  }
}
