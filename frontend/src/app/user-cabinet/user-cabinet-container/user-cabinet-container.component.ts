import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-cabinet-container',
  templateUrl: './user-cabinet-container.component.html',
  styleUrls: ['./user-cabinet-container.component.scss']
})
export class UserCabinetContainerComponent implements OnInit {
  public active = 1;

  constructor() { }

  ngOnInit(): void {
  }
}
