import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword = false;

  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  ngOnInit(): void {}

  teste(event: MouseEvent) {
    let target = event.target as HTMLElement;
    target.style.backgroundColor = this.getRandomColor();
    setTimeout(() => {
      target.style.backgroundColor = '#ffffff33';
    }, 1000);
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe((res: any) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home/dashboard']);
      }
    });
  }
}
