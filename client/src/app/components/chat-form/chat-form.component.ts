import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { RoomService } from 'src/app/services/room.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    private roomService: RoomService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.roomSub = this.roomService
      .roomChange
      .subscribe((data) => {
        this.room = data.channel;
      });

    this.chatService.changeName(localStorage.getItem("userName"));
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
