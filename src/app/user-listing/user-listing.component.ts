import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {Subscription} from 'rxjs';




@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {


  resultSubscription: Subscription;
  resultFound = [];
  current = 5;
  next = 10;
  totalCount : number;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.resultSubscription = this.userService.resultSubject.subscribe(
      result => {
        if (result) {
          this.resultFound = result.data.items;
          this.totalCount = result.data.total_count;
          console.log(this.resultFound);
        } else {
          console.log('noting');
        }
      }
    );
  }

}
