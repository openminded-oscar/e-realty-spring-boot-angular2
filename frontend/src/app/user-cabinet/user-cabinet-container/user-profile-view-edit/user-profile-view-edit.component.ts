import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {apiBase} from '../../../commons';
import {Photo} from '../../../app-models/photo';
import {FileUploadService} from '../../../app-services/file-upload.service';
import {GlobalNotificationService} from '../../../app-services/global-notification.service';
import {User, UserRole} from '../../../app-models/user';
import {UserService} from '../../../app-services/user.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile-view-edit.component.html',
  styleUrls: ['./user-profile-view-edit.component.scss']
})
export class UserProfileViewEditComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public user: User;
  public isEditMode = false;
  public defaultUserPhoto = 'https://placehold.co/250x300?text=User+photo';
  public realtorForm: FormGroup;
  public isRealtor = false;

  constructor(
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private notificationService: GlobalNotificationService,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.userService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.user = user);

    if (this.user.roles.includes(UserRole.Realtor)) {
      this.realtorForm = this.fb.group({
        isRealtorControl: new FormControl({value: false, disabled: true}),
      });
      this.isRealtor = true;
      this.realtorForm.setValue({
        'isRealtorControl': true
      });
    }
  }

  public save() {
    this.userService.updateUserProfileOnServer(this.user).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(user => {
      this.notificationService.showNotification('User Profile was Updated');
      this.isEditMode = false;
    });
  }

  public onUserPhotoSelecting(event: Event) {
    const fileList: FileList = (event.target as HTMLInputElement).files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.fileUploadService.upload(file, apiBase + '/upload-photo/profile')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: Photo) => {
            this.user.profilePic = data;
            this.user.profilePic.fullUrl = Photo.getLinkByFilename(data.filename);
            this.user.profilePicUrl = Photo.getLinkByFilename(data.filename);
          },
          error: error => console.log(error)
        });
    }
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
