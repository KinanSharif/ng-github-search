import {Injectable} from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpBackend} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {User} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  searchUsersEndPoint = 'https://api.github.com/search/users?q=';
  errorData: {};

  resultSubject = new Subject<User[]>();

  private http: HttpClient;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  getUsers(name: string) {
    const url = `${this.searchUsersEndPoint}${name}`;
    this.http.get<User[]>(url)
      .pipe(
        catchError(this.handleError)
      ).subscribe(
      (data) => {
        this.resultSubject.next(data);
      }
    );
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
