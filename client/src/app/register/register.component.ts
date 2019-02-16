import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  credentials: TokenPayload = {
    id: 0,
    nickname: '',
    login: '',
    password: ''
  }

  constructor(private auth: AuthenticationService, private router: Router) { }

  register () {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/home')
      },
      err => {
        console.error(err)
      }
    )
  }
  
  ngOnInit() {
  }

}
