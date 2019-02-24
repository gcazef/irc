import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string) : void {
    localStorage.setItem('userToken', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('userToken');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.http.post(environment.serverUrl + "/register", user);
  }

  public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(environment.serverUrl + "/login", user);

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token.toString());
          localStorage.setItem("userName", user.name);
        }
        return data;
      })
    )
    return request;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('userToken');
    this.router.navigateByUrl('/login');
  }
}

export interface UserDetails {
  id: number;
  name: string;
  pwdhash: string;
  exp: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  name: string;
  pwdhash: string;
}