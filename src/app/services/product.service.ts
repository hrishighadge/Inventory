import { Injectable } from '@angular/core';
import { productDetails } from '../models/product';
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
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  getProduct(id: string): Observable<boolean> {
    return this.httpClient
      .get<any>(
        constants.SERVER_URL + 'api/product/' + JSON.stringify({ id: [id] })
      )
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  getMultipleProducts(IDs: any): Observable<boolean> {
    return this.httpClient
      .get<any>(
        constants.SERVER_URL + 'api/product/' + JSON.stringify({ id: IDs })
      )
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  deleteMultipleProducts(IDs: any): Observable<boolean> {
    return this.httpClient
      .delete<any>(
        constants.SERVER_URL + 'api/product/' + JSON.stringify({ id: IDs }),
        {
          headers: new HttpHeaders({
            Authorization: localStorage.getItem('currentUser') || null,
          }),
        }
      )
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  getProducts(): Observable<boolean> {
    return this.httpClient.get<any>(constants.SERVER_URL + 'api/product/').pipe(
      retry(3),
      catchError(this.handleError) // then handle the error
    );
  }

  searchProduct(query: string): Observable<boolean> {
    return this.httpClient
      .get<any>(constants.SERVER_URL + 'api/product/search/' + query)
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  addProduct(product: productDetails): Observable<boolean> {
    let formData = new FormData();

    formData.append('product_name', product.product_name);
    formData.append('product_description', product.product_description);
    formData.append('product_image', product.product_image);
    formData.append('stock', product.stock.toString());
    formData.append('part_number', product.part_number);
    formData.append('unit_cost', product.unit_cost);
    formData.append('selling_price', product.selling_price);
    formData.append('prod_details', JSON.stringify(product.details));

    return this.httpClient
      .post<any>(constants.SERVER_URL + 'api/product', formData, {
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

  updateFile(product: FormData): Observable<boolean> {
    return this.httpClient
      .post<any>(constants.SERVER_URL + 'api/product/file', product, {
        headers: new HttpHeaders({
          Authorization: localStorage.getItem('currentUser') || null,
        }),
      })
      .pipe(
        retry(3),
        catchError(this.handleError) // then handle the error
      );
  }

  updateProduct(product: productDetails): Observable<boolean> {
    let formData = new FormData();

    formData.append('product_name', product.product_name);
    formData.append('product_description', product.product_description);
    formData.append('product_image', product.product_image);
    formData.append('stock', product.stock.toString());
    formData.append('part_number', product.part_number);
    formData.append('unit_cost', product.unit_cost);
    formData.append('selling_price', product.selling_price);
    formData.append('prod_details', JSON.stringify(product.details));
    formData.append('inputValue', product.inputValue ? product.inputValue : '');

    return this.httpClient
      .put<any>(constants.SERVER_URL + 'api/product/' + product._id, formData, {
        headers: new HttpHeaders({
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
