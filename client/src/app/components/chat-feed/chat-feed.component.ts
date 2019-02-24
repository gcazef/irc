import { Component, OnInit, QueryList, ElementRef, ViewChildren } from '@angular/core';
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

  @ViewChildren("messageDiv") messageDiv: QueryList<ElementRef>

  constructor(
    private chatService: ChatService,
    private roomService: RoomService,
    private notifier: NotifierService
  ) {  }

  ngAfterViewInit() {
    this.messageDiv.changes.subscribe(() => {
      if (this.messageDiv && this.messageDiv.last) {
        this.messageDiv.last.nativeElement.focus();
      }
    });
  }

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
