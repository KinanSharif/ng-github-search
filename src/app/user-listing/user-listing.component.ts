import {Component, ElementRef, OnInit, Renderer} from '@angular/core';
import {UserService} from '../user.service';
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
  showDetail: number;

  constructor(private userService: UserService, private renderer: Renderer, private elem: ElementRef) {
  }

  ngOnInit() {
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

    this.changeTextofAllBtns();
    this.changeTextofSingleBtn(index, event);

    if (this.showDetail !== index) {
      this.resultRepo = null;

    } else {

      this.userService.getUserRepo(userName).subscribe(
        (data) => {
          this.resultRepo = data;
          console.log(this.resultRepo);
        },
        error => console.log(error)
      );
    }
  }

  changeTextofSingleBtn(index, event) {
    if (this.showDetail !== index) {
      this.showDetail = index;
      event.srcElement.innerHTML = 'Collapse';
    } else {
      this.showDetail = -1;
      event.srcElement.innerHTML = 'Details';
    }
  }

  changeTextofAllBtns() {
    const btnEls = this.elem.nativeElement.querySelectorAll('.btn-outline-primary');
    btnEls.forEach(function (value) {
      value.innerHTML = 'Details';
    });
  }

}
