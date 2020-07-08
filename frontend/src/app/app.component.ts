import {Component, OnInit} from '@angular/core';
import {UserService} from "./services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RealPerfect';

  constructor() {
  }

  ngOnInit(): void {

  }
}
