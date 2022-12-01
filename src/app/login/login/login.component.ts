import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword = false;

  constructor() {}

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
}
