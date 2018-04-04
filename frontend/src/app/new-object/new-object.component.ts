import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {ConfigService} from "../services/config.service";
import {FileUploadService} from "../services/file-upload.service";
import {endpoints, apiBase} from "../commons";
import {RealtyObj} from "../domain/realty-obj";
import {RealtyObjService} from "../services/realty-obj.service";


@Component({
  selector: 'new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css']
})
export class NewObjectComponent implements OnInit, OnChanges {
  @Input()
  public realtyObj: RealtyObj;
  public realters: string[];
  public dwellingTypes: string[];
  public buildingTypes: string[];
  public supportedOperations: any[];

  public get targetOperations() {
    return this.supportedOperations
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }

  public constructor(public config: ConfigService, public fileUploadService: FileUploadService, public realtyObjService: RealtyObjService) {
  }

  public ngOnInit() {
    this.realtyObj = new RealtyObj();
    this.realters = ["Petro Petrenko", "Pavlo Pavlenko", "Andriy Andriyenko", "Ivan Ivanenko"];
    this.supportedOperations = this.config.supportedOperations
      .map((value, index, array) => <any> {value: value, name: value, checked: false});
    this.dwellingTypes = this.config.supportedDwellingTypes;
    this.buildingTypes = this.config.supportedBuildingTypes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.supportedOperations = this.config.supportedOperations.map((value, index, array) => <any>{
      value: value,
      name: value,
      checked: this.realtyObj.checkIfOperationSupported(value)
    });
  }

  saveRealtyObject() {
    this.realtyObjService.save(this.realtyObj).subscribe((data: RealtyObj) => {
      this.realtyObj = data;
    }, error => {
      alert('error');
    });
  }

  onVerificationPictureSelecting(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + "/upload-photo")
        .subscribe(
          data => {
            this.realtyObj.verificationPicture = {
              link: (endpoints.pathToPictures + data.filename),
              filename: data.filename
            };
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
      this.fileUploadService.upload(file, apiBase + "/upload-photo")
        .subscribe(
          data => {
            this.realtyObj.pictures.push({link: (endpoints.pathToPictures + data.filename), filename: data.filename})
          },
          error => console.log(error)
        );
      ;
    }
  }
}
