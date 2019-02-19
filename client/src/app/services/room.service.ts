import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  @Output() roomChange: EventEmitter<string> = new EventEmitter();

  public switchRoom(room: string) {
    this.roomChange.emit(room);
  }
}
