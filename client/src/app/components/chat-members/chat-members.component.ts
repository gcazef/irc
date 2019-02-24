import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-members',
  templateUrl: './chat-members.component.html',
  styleUrls: ['./chat-members.component.scss']
})
export class ChatMembersComponent implements OnInit {
  private memSub: Subscription;
  private members: string[];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.members = [];
    this.memSub = this.chatService
      .newMembers()
      .subscribe((names) => {
        names.forEach(name => {
          if (!this.members.includes(name)) {
            this.members.push(name);
          }
        });
      });
    this.chatService.getUsers();
  }

  ngOnDestroy() {
    this.memSub.unsubscribe();
  }
}
