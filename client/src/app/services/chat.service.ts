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
    this.socket = io(this.url);
  }

  // User
  public changeName(name: string) {
    this.socket.emit("change-uname", name);
  }

  // Chat
  public sendMessage(message: string, room: string) {
    this.socket.emit("chat-message", message, room);
  }

  public getMessage = () => {
    return Observable.create((observer) => {
      this.socket.on("chat-message", (message) => {
        observer.next(message);
      });
    });
  }

  // Rooms
  public getAllRooms() {
    this.socket.emit("get-rooms");
  }

  public roomsList = () => {
    return Observable.create((observer) => {
      this.socket.on("get-rooms", (channels) => {
        observer.next(channels);
      });
    });
  }

  public createRoom = (room: string) => {
    this.socket.emit("create-room", room);
  }

  // edit

  // delete

  public getRoomEvent = () => {
    return Observable.create((observer) => {
      this.socket.on("room-event", (event) => {
        observer.next(event);
      });
    });
  }

  public join = (room: string) => {
    this.socket.emit("join", room);
  }

  public leave = (room: string) => {
    this.socket.emit("leave", room);
  }

  public getUserEvent = () => {
    return Observable.create((observer) => {
      this.socket.on("user-event", (event) => {
        observer.next(event);
      });
    });
  }
}
