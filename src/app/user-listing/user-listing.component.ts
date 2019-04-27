import {Component, ElementRef, OnInit, Renderer} from '@angular/core';
import {UserService} from '../services/user.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {


  resultSubscription: Subscription;
  resultRepo = [];
  resultFound = [];
  totalCount: number;
  resultStatus = false;
  isResultFoundSubscription: Subscription;
  showLoadingImageSubscription: Subscription;
  showDetailSubscription: Subscription;
  showDetail = -1;
  showLoadingImage = false;
  p = 1;
  buttonText = [];

  constructor(private userService: UserService, private renderer: Renderer, private elem: ElementRef) {
  }

  ngOnInit() {

    this.showLoadingImageSubscription = this.userService.showLoadingImage.subscribe(
      result => {
        if (result) {
          this.showLoadingImage = true;
        } else {
          this.showLoadingImage = false;
        }
      }
    );

    this.showDetailSubscription = this.userService.showDetail.subscribe(
      result => {
        if (result) {
          this.showDetail = result;
        }
      }
    );

    this.resultSubscription = this.userService.resultSubject.subscribe(
      result => {

        if (result.data.total_count > 0) {
          this.resultFound = result.data.items;
          this.totalCount = result.data.total_count;
        }

      }
    );

    this.isResultFoundSubscription = this.userService.isResultFound.subscribe(
      result => {
        if (result) {
          this.resultStatus = false;
        } else {
          this.resultStatus = true;
        }
      }
    );
  }

  showUserDetail(index: number, userName: string, event) {
    this.showLoadingImage = true;

    this.changeTextOfAllBtns();
    this.changeTextOfSingleBtn(index, event);

    if (this.showDetail !== index) {
      this.resultRepo = null;
      this.showLoadingImage = false;

    } else {

      this.userService.getUserRepo(userName).subscribe(
        (data) => {
          this.resultRepo = data;
          this.showLoadingImage = false;
        },
        error => {
          console.log(error);
          this.showLoadingImage = false;
        }
      );
    }
  }

  changeTextOfSingleBtn(index, event) {
    if (this.showDetail !== index) {
      this.showDetail = index;
      this.buttonText[index] = 'Collapse';
    } else {
      this.showDetail = -1;
      this.buttonText[index] = 'Details';
    }
  }

  changeTextOfAllBtns() {
    for (let i = 0; i < this.resultFound.length; i++) {
      this.buttonText[i] = 'Details';
    }
  }

  onPageChange(event) {
    this.p = event;
    this.hideDetailRepoSection();
  }

  /**
   * assigning showDetail to -1
   * hides the visibility of the detail repo section
   */
  hideDetailRepoSection() {
    this.showDetail = -1;
  }

}
