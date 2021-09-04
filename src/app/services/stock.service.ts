import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { constants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private httpClient: HttpClient) {}

  getStocks(dates: any): Observable<boolean> {
    return this.httpClient.get<any>(constants.SERVER_URL + 'api/stocks/'+dates.start_date+"/"+dates.end_date,{
          headers: new HttpHeaders({
            Authorization: localStorage.getItem('currentUser') || null,
          }),
        }).pipe(
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
