import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {apiBase} from '../../../commons';
import {Photo} from '../../../domain/photo';
import {FileUploadService} from '../../../services/file-upload.service';
import {GlobalNotificationService} from '../../../services/global-notification.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../../domain/user';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile-view-edit.component.html',
  styleUrls: ['./user-profile-view-edit.component.scss']
})
export class UserProfileViewEditComponent implements OnInit, OnDestroy {
  public user: User;
  private destroy$ = new Subject<boolean>();
  public isEditMode = false;
  public defaultUserPhoto = 'https://placehold.co/250x300?text=User+photo';
  public role = 'User';

  constructor(
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private notificationService: GlobalNotificationService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => this.user = user);
  }

  public save() {
    this.userService.updateUserProfileOnServer(this.user).pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (this.user.role) {
        this.role = user.role;
      }
      this.notificationService.showNotification('User Profile was Updated');
      this.isEditMode = false;
    });
  }

  public onUserPhotoSelecting(event: Event) {
    const fileList: FileList = (event.target as HTMLInputElement).files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + '/upload-photo/profile')
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data: Photo) => {
            this.user.profilePic = data;
            this.user.profilePic.fullUrl = Photo.getLinkByFilename(data.filename);
            this.user.profilePicUrl = Photo.getLinkByFilename(data.filename);
          },
          error => console.log(error)
        );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public goToEditMode() {
    this.isEditMode = true;
  }

  public setDefaultUserPhoto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultUserPhoto;
  }

  public cancelChanges() {
    this.isEditMode = false;
  }

  public clearAvatar() {
    this.user.profilePic = null;
    this.user.profilePicUrl = null;
  }
}
