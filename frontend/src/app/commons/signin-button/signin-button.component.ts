import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'signin-button',
  templateUrl: './signin-button.component.html',
  styleUrls: ['./signin-button.component.css']
})
export class SigninButtonComponent implements OnInit {
  showLoginButton: boolean = false;
  login: string;
  password: string;

  constructor(private userService: UserService, private modalService: NgbModal) {
    this.showLoginButton = this.userService.isAuthenticated();
  }

  ngOnInit() {
  }

  openModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }
}
