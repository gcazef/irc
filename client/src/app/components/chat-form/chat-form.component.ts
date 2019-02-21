import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
  message: string = "";
  room: string = "";

  constructor(
    private chatService: ChatService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.roomService
      .roomChange
      .subscribe((room) => {
        this.room = room;
      });
  }

  sendMessage() {
    if (this.room != "") {
      this.chatService.sendMessage(this.message, this.room);
      this.message = "";
    }
  }
}
