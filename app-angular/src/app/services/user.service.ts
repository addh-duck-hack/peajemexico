import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserResponse } from '../shared/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private http = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  env = environment;
  sessionUser = signal<UserResponse | null>(null);

  constructor() {
    if (this.isBrowser) this.loadSession();
  }

  saveSession(user: UserResponse): void {
    this.sessionUser.set(user);
    if (this.isBrowser) localStorage.setItem(this.env.localStorageName, JSON.stringify(user));
  }

  loadSession(): void {
    if (!this.isBrowser) return;
    const data = localStorage.getItem(this.env.localStorageName);
    if (data) {
      const userResponse: UserResponse = JSON.parse(data);
      if (this.isTokenValid(userResponse.token)) {
        this.sessionUser.set(userResponse);
      } else {
        this.clearSession();
      }
    }
  }

  clearSession(): void {
    this.sessionUser.set(null);
    if (this.isBrowser) localStorage.removeItem(this.env.localStorageName);
  }

  isTokenValid(token?: string): boolean {
    const jwt = token || this.sessionUser()?.token;
    if (!jwt) return false;
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  loginNewSession(email:string, pass:string):Observable<UserResponse> {
    const bodyRequest = {
      email: email,
      password: pass
    };
    return this.http.post<UserResponse>(`${ this.env.urlbackend }/api/ds/users/login`,bodyRequest);
  }

  registerNewUser(name:string, email:string, pass:string):Observable<UserResponse> {
    const bodyRequest = {
      name: name,
      email: email,
      password: pass
    };
    return this.http.post<UserResponse>(`${ this.env.urlbackend }/api/ds/users/register`,bodyRequest);
  }

  validateEmail(token: string): Observable<UserResponse>{
    return this.http.get<UserResponse>(`${ this.env.urlbackend }/api/ds/users/verify`, {
      params:{
        token: token
      }
    });
  }

  forgotPassword(email:String): Observable<UserResponse>{
    const bodyRequest = {
      email: email
    };
    return this.http.post<UserResponse>(`${ this.env.urlbackend }/api/ds/users/forgot-password`,bodyRequest);
  }

  resetPassword(token:string, pass:string): Observable<UserResponse>{
    const bodyRequest = {
      newPassword: pass,
      token: token
    };
    return this.http.post<UserResponse>(`${ this.env.urlbackend }/api/ds/users/reset-password`,bodyRequest);
  }
}
