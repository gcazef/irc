import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from 'src/app/authentication.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    id: 0,
    nickname: '',
    login: '',
    password: ''
  }

  credentials: TokenPayload = {
    id: 0,
    nickname: '',
    login: '',
    password: ''
  }

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/home')
      },
      err => {
        console.error(err)
      }
    )
  }

  redirect() {
    this.router.navigate(['/home']);
  }
}
