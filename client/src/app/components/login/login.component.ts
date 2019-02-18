import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private name: string;

  constructor(
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit() {
  }


  redirect(name: string) {
    this.chatService.changeName(name);
    this.router.navigate(['./home']);
  }
}
