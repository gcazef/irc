import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-chat-channels',
  templateUrl: './chat-channels.component.html',
  styleUrls: ['./chat-channels.component.scss']
})
export class ChatChannelsComponent implements OnInit {
  room: string = "";
  rooms: string[] = [];
  joinedRooms: string[] = [];

  constructor(
    private chatService: ChatService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.chatService
      .getRoomEvent()
      .subscribe((event) => {
        if (event.type == "new" && !(this.rooms.includes(event.room)))
          this.rooms.push(event.room);
      });
  }

  createRoom() {
    if (this.room.length > 0 && this.room.length < 25 && this.room.match("^[A-z0-9]+$")) {
      this.room = "#" + this.room;
      if (!this.rooms.includes(this.room)) {
        this.chatService.createRoom(this.room);
        this.rooms.push(this.room);
      }
      this.room = "";
    }
  }

  join(room: string) {
    if (!this.joinedRooms.includes(room))
      this.joinedRooms.push(room);
    this.chatService.join(room);
    this.roomService.switchRoom(room);
    this.room = room;
  }

  leave(room: string) {
    var idx = this.joinedRooms.indexOf(room);

    if (idx != -1) {
      this.chatService.leave(room);
      this.joinedRooms.splice(idx, 1);
      if (this.joinedRooms.length > 0) {
        this.roomService.switchRoom(this.joinedRooms[this.joinedRooms.length - 1]);
        this.room = this.joinedRooms[this.joinedRooms.length - 1];
      } else {
        this.roomService.switchRoom("");
        this.room = "";
      }
    }
  }

  //edit(room: string, name: string)

  //delete(room: string)
}
