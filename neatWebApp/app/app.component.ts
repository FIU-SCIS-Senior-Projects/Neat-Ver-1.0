import { Component }          from '@angular/core';

@Component({
  selector: 'my-app',

  template: `
    <h1>{{title}}</h1>
  `,
  styleUrls: ['app/app.component.css']
})
export class AppComponent {
  title = 'Welcome to Neat';
}

//<nav>
//      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
//    </nav>
//    <router-outlet></router-outlet>