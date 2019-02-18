import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
  message: string;
  room: string;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  sendMessage() {
    this.chatService.sendMessage(this.message, this.room);
    this.message = '';
  }
}
