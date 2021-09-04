import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { constants } from '../constants';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get isLoggedIn() {
    let token = localStorage.getItem('currentUser');
    if (!token) {
      this.loggedIn.next(false);
      return this.loggedIn.asObservable();
    }
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    this.loggedIn.next(!isExpired);
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<any>(`${constants.SERVER_URL}api/user/auth`, {
        email: email,
        password: password,
      })
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', user.token);
            this.loggedIn.next(true);
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
