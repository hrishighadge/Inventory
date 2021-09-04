import { Injectable } from '@angular/core';
import { Order } from '../models/order';
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
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  getOrder(id: string): Observable<boolean> {
    return this.httpClient
      .get<any>(constants.SERVER_URL + 'api/order/' + id)
      .pipe(
        retry(3)
        // catchError(this.handleError) // then handle the error
      );
  }

  getOrders(): Observable<boolean> {
    return this.httpClient
      .get<any>(constants.SERVER_URL + 'api/order/', {
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
  searchOrders(searchQuery: string): Observable<boolean> {
    return this.httpClient
      .get<any>(constants.SERVER_URL + 'api/order/search/' + searchQuery, {
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
  placeOrder(orderDetails: Order): Observable<boolean> {
    return this.httpClient
      .post<any>(constants.SERVER_URL + 'api/order/', orderDetails)
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  updateOrder(updateorderDetails: any): Observable<boolean> {
    return this.httpClient
      .put<any>(
        constants.SERVER_URL + 'api/order/' + updateorderDetails.id,
        updateorderDetails,
        {
          headers: new HttpHeaders({
            // 'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('currentUser') || null,
          }),
        }
      )
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
