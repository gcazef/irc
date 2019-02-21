import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.scss']
})
export class ChatFeedComponent implements OnInit {
  private messages = [];
  private roomMsg = "";
  private room = "";
  private chatSub: Subscription;
  private roomEventSub: Subscription;
  private roomSub: Subscription;

  constructor(
    private chatService: ChatService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.chatSub = this.chatService
      .getMessages()
      .subscribe((data) => {
        if (data.room === this.room) {
          this.messages.push(data);
          this.roomMsg = "";
        }
      });

    this.roomEventSub = this.chatService
      .getRoomEvent()
      .subscribe((event) => {
        this.roomMsg = event.message;
      });

    this.roomSub = this.roomService
      .roomChange
      .subscribe((room: string) => {
        this.room = room;
        this.messages = [];
        // get messages from chat service
      });
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
    this.roomEventSub.unsubscribe();
    this.roomSub.unsubscribe();
  }
}
