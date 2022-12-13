import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isUserAuthenticated(): boolean {
    return true;
  }

  login(loginForm: any) {
    return this.http.post(
      'https://healthlabapi-production.up.railway.app/auth/authenticate',
      loginForm
    );
  }

  register(registerForm: any) {
    return this.http.post(
      'https://healthlabapi-production.up.railway.app/auth/register',
      {
        email: 'home@gmail.com',
        name: 'Home',
        password: '123456',
      }
    );
  }
}
