import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {Subscription} from 'rxjs';
import {User} from '../user.model';



@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {


  resultSubscription: Subscription;
  resultFound: User[] = [];
  current = 5;
  next = 10;
  totalCount : number;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.resultSubscription = this.userService.resultSubject.subscribe(
      result => {
        if (result) {
          this.resultFound = result.items;
          this.totalCount = result.total_count;
          console.log(result);
        } else {
          console.log('noting');
        }
      }
    );
  }

}
