import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-repo',
  templateUrl: './user-repo.component.html',
  styleUrls: ['./user-repo.component.css']
})
export class UserRepoComponent implements OnInit {

  constructor() {
  }

  @Input() resultRepo: string[];

  ngOnInit() {
  }

}
