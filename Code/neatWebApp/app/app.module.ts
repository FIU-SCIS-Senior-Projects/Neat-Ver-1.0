import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }         from './app.component';
import { DashboardComponent }   from './dashboard.component';
import { UserService }          from './user.service';
import { routing }              from './app.routing';

@NgModule({
  imports: [ BrowserModule,
    FormsModule,
    HttpModule,
    routing ],
  declarations: [ AppComponent,
    DashboardComponent ],
  providers: [ UserService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
