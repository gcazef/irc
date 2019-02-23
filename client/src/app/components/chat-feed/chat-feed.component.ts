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
      .getMessage()
      .subscribe((data) => {
        if (data.channel === this.room) {
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
      .subscribe((data) => {
        this.roomMsg = "";
        if (data.channel === null) {
          this.room = "";
          this.messages = [];
        } else {
          this.room = data.channel;
          data.messages.forEach(msg => {
            this.messages.push(msg);
          });
        }
      });
  }

  ngOnDestroy() {
    this.chatSub.unsubscribe();
    this.roomEventSub.unsubscribe();
    this.roomSub.unsubscribe();
  }
}
