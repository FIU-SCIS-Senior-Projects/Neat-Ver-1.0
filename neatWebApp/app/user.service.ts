import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';
import { Token } from './token';

@Injectable()
export class UserService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private usersUrl = 'http://127.0.0.1:8000/restapi/login/';  // URL to web api

  constructor(private http: Http) { }

  login(usr: User): Promise<Token> {
    return this.http
      .post(this.usersUrl, JSON.stringify(usr), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

/*
  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
               .toPromise()
               .then(response => response.json().data as User[])
               .catch(this.handleError);
  }

  getUser(id: number): Promise<User> {
    return this.getUsers()
               .then(users => users.find(user => user.id === id));
  }

  delete(id: number): Promise<void> {
    let url = `${this.usersUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(name: string): Promise<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  update(user: User): Promise<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), {headers: this.headers})
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

}

*/
}