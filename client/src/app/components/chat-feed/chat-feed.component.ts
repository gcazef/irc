import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.scss']
})
export class ChatFeedComponent implements OnInit {
  messages = [];
  roomMsg = "";
  room = "";

  constructor(
    private chatService: ChatService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((data) => {
        this.messages.push(data);
        this.roomMsg = "";
      });
    
    this.chatService
      .getRoomEvent()
      .subscribe((event) => {
        this.roomMsg = event.message;
      });

    this.roomService
      .roomChange
      .subscribe((room) => {
        this.room = room;
        //get messages from chat service
      });

  }
}
