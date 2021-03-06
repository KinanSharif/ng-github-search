import {Injectable} from '@angular/core';

import {HttpClient, HttpErrorResponse, HttpBackend} from '@angular/common/http';
import {Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private searchUsersEndPoint = 'https://api.github.com/search/users?q=';
  private getUserDetailsEndPoint = 'https://api.github.com/users/';
  errorData: {};

  resultSubject = new Subject<any>();
  isResultFound = new Subject<boolean>();
  showLoadingImage = new Subject<boolean>();
  showDetail = new Subject<number>();
  cacheResult;
  valuesOnSearch = new Subject<any>();

  private http: HttpClient;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  /**
   * get http
   * checks the result count
   * initialize cacheResult
   * sort cacheResult according to sortValue
   * isResultFound keeps track of disabling sort select in the header
   * @param name
   * @param sortValue
   */

  getUsers(userName: string, sortValue: string, page: number) {
    this.showLoadingImage.next(true);
    this.valuesOnSearch.next({userName: userName, sortValue: sortValue});
    const url = `${this.searchUsersEndPoint}${userName}&page=${page}&per_page=10`;
    this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      ).subscribe(
      (data) => {
        if (data.total_count > 0) {
          this.cacheResult = data;
          this.cacheResult.items = this.sort(this.cacheResult.items, sortValue);
          this.resultSubject.next({data: this.cacheResult});
          this.isResultFound.next(true);
          this.showLoadingImage.next(false);
          this.showDetail.next(-1);
        } else {
          this.isResultFound.next(false);
          this.showLoadingImage.next(false);
          this.showDetail.next(-1);
        }
      }
    );
  }

  getUserRepo(userName: string) {
    const url = `${this.getUserDetailsEndPoint}${userName}/repos`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * call sort() on sort select change the current result.
   * @param sortValue
   */

  sortFoundUsers(sortValue: string) {
    this.cacheResult.items = this.sort(this.cacheResult.items, sortValue);
    this.resultSubject.next({data: this.cacheResult});
  }

  /**
   * sort according to name or rank
   * @param data
   * @param sortValue
   */

  sort(data: any[], sortValue: string) {
    if (sortValue.substring(0, 4) === 'name') {
      return this.sortName(data, sortValue);
    } else if (sortValue.substring(0, 4) === 'rank') {
      return this.sortRank(data, sortValue);
    }
  }

  /**
   * sort according name asc or desc
   * @param data
   * @param ascOrDesc
   */

  sortName(data: any[], ascOrDesc: string) {
    if (ascOrDesc === 'nameAsc') {
      return data.sort((a, b) => a.login > b.login ? 1 : -1);
    } else {
      return data.sort((a, b) => a.login < b.login ? 1 : -1);
    }

  }

  /**
   * sort according rank "score" asc or desc
   * @param data
   * @param ascOrDesc
   */

  sortRank(data: any[], ascOrDesc: string) {
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
