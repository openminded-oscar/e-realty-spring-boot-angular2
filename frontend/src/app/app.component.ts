import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {endpoints} from "./commons";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RealPerfect';
  dataInitialised = false;
  isAuthenticated = false;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  ngOnInit(): void {
    this.reset();
  }

  fetchUserStatus() {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': localStorage.getItem('token') || ''
    });

    this.http.get(endpoints.userStatus, {headers}).subscribe(
      (userInfo: any) => {
        const isAuthenticated = !!userInfo;
        this.userService.user = userInfo;
        this.userService.isAuthenticated = isAuthenticated;
        this.isAuthenticated = isAuthenticated;
        this.dataInitialised = true;
      }, error => {
        this.dataInitialised = true;
      });
  }

  reset() {
    this.dataInitialised = false;

    if (localStorage.getItem('token')) {
      this.fetchUserStatus();
    } else {
      this.userService.isAuthenticated = false;
      this.userService.user = null;
      this.isAuthenticated = false;
      this.dataInitialised = true;
    }
  }
}
