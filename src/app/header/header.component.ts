import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public searchUserName: string;
  public sortValue = 'nameAsc';
  disableIfNoResult = true;


  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  /**
   * takes in both values to set the result
   * @param name
   * @param sortValue
   */

  onSearchUserName(name: string, sortValue: string) {

    console.log(name);
    if (name != null && name !== "") {
      this.userService.getUsers(name, sortValue);
      this.disableIfNoResult = false;
    }

  }

  /**
   * sort the current result
   * @param sortValue
   */

  onChangeSelect(sortValue) {
    this.userService.sortFoundUsers(sortValue);
  }

}
