import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private token: string

  constructor(private http:HttpClient, private router: Router) { }

  private saveToken(token: string) : void {
    localStorage.setItem('userToken', token)
    this.token = token
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('userToken')
    }
    return this.token
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken()
    let payload
    if(token) {
      payload = token.split('.')[1]
      payload = window.atob(payload)
      return JSON.parse(payload)
    } else {
      return null
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails()
    if(user) {
      return user.exp > Date.now() / 1000
    } else {
      return false
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.http.post(`http://localhost:5000/register`, user)
  }

  public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(`http://localhost:5000/login`, user)

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token)
        }
        return data
      })
    )

    return request
  }

  public logout(): void {
    this.token = ``
    window.localStorage.removeItem('userToken')
    this.router.navigateByUrl('/')
  }
}

export interface UserDetails {
  id: number
  nickname: string
  login: string
  password: string
  exp: number
}

interface TokenResponse{
  token: string
}

export interface TokenPayload{
  id: number
  nickname: string
  login: string
  password: string
}