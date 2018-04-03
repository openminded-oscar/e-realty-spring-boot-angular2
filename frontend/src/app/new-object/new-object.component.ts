import {Component, OnInit} from "@angular/core";
import {ConfigService} from "../services/config.service";
import {FileUploadService} from "../services/file-upload.service";
import {pathToPictures, webServiceEndpoint} from "../commons";


@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit {
  public supportedOperations: string[];
  public realtyObj: any = {pictures: []};

  public constructor(public config: ConfigService, public fileUploadService: FileUploadService) {
  }

  public ngOnInit() {
    this.supportedOperations = this.config.getSupportedOperations();
  }

  onVerificationPictureSelecting(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.fileUploadService.upload(file, webServiceEndpoint + "/upload-photo")
        .subscribe(
          data => {
            this.realtyObj.verificationPicture = {link: (pathToPictures + data.filename), filename: data.filename};
          },
          error => console.log(error)
        );
      ;
    }
  }

  onRealtyObjPictureSelecting(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.fileUploadService.upload(file, webServiceEndpoint + "/upload-photo")
        .subscribe(
          data => {
            this.realtyObj.pictures.push({link: (pathToPictures + data.filename), filename: data.filename})
          },
          error => console.log(error)
        );
      ;
    }
  }
}
