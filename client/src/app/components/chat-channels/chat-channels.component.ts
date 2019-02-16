import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-channels',
  templateUrl: './chat-channels.component.html',
  styleUrls: ['./chat-channels.component.scss']
})
export class ChatChannelsComponent implements OnInit {
  room: string = "";
  rooms: string[] = [];
  joinedRooms: string[] = [];

  constructor(private chatService: ChatService) { }

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
    this.chatService.join(room);
  }

  leave(room: string) {
    this.chatService.leave(room);
  }
}
