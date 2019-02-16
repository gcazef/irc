import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.scss']
})
export class ChatFeedComponent implements OnInit {
  joinedRooms: string[] = [];
  messages = [];
  roomMsg = "";

  constructor(private chatService: ChatService) { }

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
  }
}
