import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from "rxjs/Observable";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = environment.serverUrl;
  private socket;

  constructor() {
    //erreurs
    this.socket = io(this.url);
  }

  public changeName(name: string) {
    this.socket.emit("change-uname", name);
  }

  public getAllRooms() {
    this.socket.emit("get-rooms");
  }

  public sendMessage(message: string, room: string) {
    this.socket.emit('chat-message', message, room);
  }

  public getMessage = () => {
    return Observable.create((observer) => {
      this.socket.on('chat-message', (message: string) => {
        observer.next(message);
      });
    });
  }

  public roomsList = () => {
    return Observable.create((observer) => {
      this.socket.on("rooms-list", (channels) => {
        observer.next(channels);
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

  public createRoom = (room: string) => {
    this.socket.emit('create-room', room);
  }

  public join = (room: string) => {
    this.socket.emit('join', room);
  }

  public leave = (room: string) => {
    this.socket.emit('leave', room);
  }

  //event error
}
