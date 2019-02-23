import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  @Output() roomChange: EventEmitter<string> = new EventEmitter();

  public switchRoom(data) {
    this.roomChange.emit(data);
  }
}
