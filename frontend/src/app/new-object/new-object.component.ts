import {Component, OnInit} from "@angular/core";
import {ConfigService} from "../services/config.service";


@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
  public supportedOperations: string[];

  public constructor(public config: ConfigService) {
  }

  public ngOnInit() {
    this.supportedOperations = this.config.getSupportedOperations();
  }
}
