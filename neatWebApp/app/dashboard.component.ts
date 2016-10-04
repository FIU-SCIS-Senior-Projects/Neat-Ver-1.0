import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { User }        from './user';
import { UserService } from './user.service';

@Component({
  selector: 'my-dashboard',
  template: `
    <div>
        <label>name: </label>
        <input [(ngModel)]="user.username" placeholder="name" />
        <input [(ngModel)]="user.password" placeholder="name" />
    </div>
    <button (click)="login()">Login</button>
  `,
  styleUrls: ['app/dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private user: User) {
  }

  ngOnInit(): void {
  }

  login(): void {
  }
}