import {Injectable} from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpBackend} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  searchUsersEndPoint = 'https://api.github.com/search/users?q=';
  errorData: {};

  resultSubject = new Subject<any>();

  private http: HttpClient;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  getUsers(name: string, sortValue: string) {
    const url = `${this.searchUsersEndPoint}${name}`;
    this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      ).subscribe(
      (data) => {
        data.items = this.sort(data.items, sortValue);
        this.resultSubject.next({data: data});
      }
    );
  }

  sort(data, sortValue) {
    if (sortValue === 'nameAsc' || sortValue === 'nameDesc') {
      return this.sortName(data, sortValue);
    } else if (sortValue === 'rankAsc' || sortValue === 'rankDesc') {
      return this.sortRank(data, sortValue);
    }
  }

  sortName(data, ascOrDesc: string) {
    if (ascOrDesc === 'nameAsc') {
      return data.sort((a, b) => a.login > b.login ? 1 : -1);
    } else {
      return data.sort((a, b) => a.login < b.login ? 1 : -1);
    }

  }

  sortRank(data, ascOrDesc: string) {
    if (ascOrDesc === 'rankAsc') {
      return data.sort((a, b) => a.score > b.score ? 1 : -1);
    } else {
      return data.sort((a, b) => a.score < b.score ? 1 : -1);
    }

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.

      console.error('An error occurred:', error.error.message);
    } else {

      // The backend returned an unsuccessful response code.

      // The response body may contain clues as to what went wrong,

      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message

    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }

}
