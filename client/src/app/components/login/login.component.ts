import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from 'src/app/services/authentication.service'
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private credentials: TokenPayload = {
    name: '',
    pwdhash: ''
  }

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private chat: ChatService
  ) { }

  ngOnInit() {
  }

  public login() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.chat.changeName(this.credentials.name);
        this.chat.getUsers();
        this.router.navigateByUrl('/');
      },
      err => {
        console.error(err);
      }
    )
  }

  public redirect() {
    this.router.navigate(['/']);
  }
}
