import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealterService} from '../../services/realter.service';
import {Realter} from '../../domain/realter';
import {ActivatedRoute} from '@angular/router';
import {apiBase} from '../../commons';
import {Photo} from '../../domain/photo';
import {FileUploadService} from '../../services/file-upload.service';
import {GlobalNotificationService} from '../../services/global-notification.service';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-add-update-realter',
  templateUrl: './add-update-realtor.component.html',
  styleUrls: ['./add-update-realtor.component.scss']
})
export class AddUpdateRealtorComponent implements OnInit, OnDestroy {
  public realter: Realter;
  public realterId: string;
  private destroy$ = new Subject<boolean>();

  constructor(private realterService: RealterService,
              private fileUploadService: FileUploadService,
              private notificationService: GlobalNotificationService,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.realter = {
      name: '',
      surname: '',
      profilePic: '',
      phoneNumber: null,
      email: null,
    } as Realter;

    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.realterId = params['realterId'];
      if (this.realterId) {
        this.realterService.findById(this.realterId).pipe(
          takeUntil(this.destroy$)
        ).subscribe((realter: Realter) => {
          this.realter = realter;
        });
      }
    });
  }

  public save() {
    if (this.realterId) {
      this.realterService.updateRealter(this.realter, this.realterId).pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(realter => {
          this.notificationService.showNotification('Realter was added');
        });
    } else {
      this.realterService.saveRealter(this.realter).pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(realter => {
          this.notificationService.showNotification('Realter was added');
        });
    }
  }

  public onRealterPhotoSelecting(event: InputEvent) {
    const fileList: FileList = (event.target as HTMLInputElement).files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + '/upload-photo/profile')
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: Photo) => {
            this.realter.profilePic = data;
            this.realter.profilePic.photoFullUrl = Photo.getLinkByFilename(data.filename);
          },
          error => console.log(error)
        );
    }
  }

  public deletePhoto() {
    alert('not yet implemented');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
