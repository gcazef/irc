import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.scss']
})
export class ChatFeedComponent implements OnInit {
  private messages = [];
  private room = "";
  private chatSub: Subscription;
  private roomEventSub: Subscription;
  private roomSub: Subscription;

  constructor(
    private chatService: ChatService,
    private roomService: RoomService,
    private notifier: NotifierService
  ) {  }

  ngOnInit() {
    this.chatSub = this.chatService
      .getMessage()
      .subscribe((data) => {
        if (data.channel === this.room) {
          this.messages.push(data);
        }
      });

    this.roomEventSub = this.chatService
      .getRoomEvent()
      .subscribe((event) => {
        if (event.type === "join") {
          this.notifier.notify( 'success', event.message );
        }
        else if (event.type === "leave") {
          this.notifier.notify( 'error', event.message );
        }
      });

    this.roomSub = this.roomService
      .roomChange
      .subscribe((data) => {
        if (data.channel === null) {
          this.room = "";
          this.messages = [];
        } else {
          this.room = data.channel;
          this.messages = [];
          data.messages.forEach(msg => {
            console.log(msg);
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
