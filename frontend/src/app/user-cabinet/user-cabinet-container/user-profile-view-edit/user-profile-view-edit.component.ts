import {Component, OnDestroy, OnInit} from '@angular/core';
import {apiBase} from '../../../commons';
import {Photo} from '../../../domain/photo';
import {FileUploadService} from '../../../services/file-upload.service';
import {GlobalNotificationService} from '../../../services/global-notification.service';
import {from, of, Subject, switchMap} from 'rxjs';
import {catchError, takeUntil} from 'rxjs/operators';
import {User} from '../../../domain/user';
import {UserService} from '../../../services/user.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../../shared/confirm-modal/confirm-modal.component';
import {RealtorService} from '../../../services/realtor.service';

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
  public realtorForm: FormGroup;

  constructor(
    private userService: UserService,
    private realtorService: RealtorService,
    private fileUploadService: FileUploadService,
    private notificationService: GlobalNotificationService,
    private fb: FormBuilder,
    private ngbModal: NgbModal,
  ) {
    this.realtorForm = this.fb.group({
      isRealtorControl: new FormControl(false),
    });
  }

  ngOnInit() {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.user = user);

    this.realtorForm.controls.isRealtorControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      switchMap(v => {
        if (v) {
          const modalRef = this.ngbModal.open(ConfirmModalComponent);
          modalRef.componentInstance.message = 'You Need To Have Confirmation From Admin. Are you sure?';
          return from(modalRef.result).pipe(
            catchError(() => of(false))
          );
        } else {
          return of(null);
        }
      }),
      switchMap((confirmed: boolean) => {
        if (confirmed) {
          return this.realtorService.claimForRealtor();
        } else {
          return of(null);
        }
      }),
      catchError((error: Error) => {
        console.error(error);
        return of(null);
      })
    ).subscribe();

  }

  public save() {
    this.userService.updateUserProfileOnServer(this.user).pipe(
      takeUntil(this.destroy$)
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
        .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
