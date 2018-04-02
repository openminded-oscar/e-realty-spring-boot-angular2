import {Component, OnInit} from "@angular/core";
import {ConfigService} from "../services/config.service";
import {FileUploadService} from "../services/file-upload.service";
import {webServiceEndpoint} from "../commons";


@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
  public supportedOperations: string[];

  public constructor(public config: ConfigService, public fileUploadService: FileUploadService) {
  }

  public ngOnInit() {
    this.supportedOperations = this.config.getSupportedOperations();
  }

  realtyObjectFilesChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.fileUploadService.upload(file, webServiceEndpoint + "/upload-photo");
    }
  }
}
