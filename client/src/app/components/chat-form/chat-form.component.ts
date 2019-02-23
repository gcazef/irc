import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
  private message = "";
  private room = "";
  private roomSub: Subscription;

  constructor(
    private chatService: ChatService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.roomSub = this.roomService
      .roomChange
      .subscribe((data) => {
        this.room = data.channel;
      });
  }

  ngOnDestroy() {
    this.roomSub.unsubscribe();
  }

  public sendMessage() {
    if (this.room !== "") {
      this.chatService.sendMessage(this.message, this.room);
      this.message = "";
    }
  }
}
