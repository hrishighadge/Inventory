import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { constants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private httpClient: HttpClient) {}

  getNotifications(): Observable<boolean> {
    return this.httpClient
      .get<any>(constants.SERVER_URL + 'api/notification/', {
        headers: new HttpHeaders({
          // 'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('currentUser') || null,
        }),
      })
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  markNotifications(): Observable<boolean> {
    return this.httpClient
      .put<any>(constants.SERVER_URL + 'api/notification/',{}, {
        headers: new HttpHeaders({
          // 'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('currentUser') || null,
        }),
      })
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
