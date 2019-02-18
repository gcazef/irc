import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from "rxjs/Observable";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = 'http://localhost:5000';
  private socket;

  constructor() {
      this.socket = io(this.url);
  }

  public changeName(name) {
      this.socket.emit("change-uname", name);
  }

  public sendMessage(message, room) {
      this.socket.emit('chat-message', message);
  }

  public getMessages = () => {
      return Observable.create((observer) => {
          this.socket.on('chat-message', (message) => {
              observer.next(message);
          });
      });
  }

  public getRoomEvent = () => {
      return Observable.create((observer) => {
          this.socket.on('room-event', (data) => {
              observer.next(data);
          });
      });
  }

  public createRoom = (room) => {
      this.socket.emit('create-room', room);
  }

  public join = (room) => {
    this.socket.emit('join', room);
  }

  public leave = (room) => {
    this.socket.emit('leave', room);
  }
}
