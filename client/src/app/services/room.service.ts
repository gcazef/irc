import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private currentRoom = "";

  @Output() roomChange: EventEmitter<string> = new EventEmitter();

  public switchRoom(room: string) {
    this.currentRoom = room;
    this.roomChange.emit(room);
  }
}
