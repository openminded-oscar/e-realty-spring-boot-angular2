import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealtorService} from '../../services/realtor.service';
import {Realtor} from '../../domain/realtor';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {UserService} from '../../services/user.service';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../domain/user';

@Component({
  selector: 'realtors-gallery',
  templateUrl: './realtors-gallery.component.html',
  styleUrls: ['./realtors-gallery.component.scss']
})
export class RealtorsGalleryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public realtors: Realtor[];
  public defaultRealtorPhoto = 'https://placehold.co/600x400?text=Realtor+photo';
  public user: User;

  constructor(private realtorService: RealtorService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.realtorService.getRealtors()
      .subscribe((realtors: Realtor[]) => {
        this.realtors = realtors;
      });

    this.userService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.user = user;
    });
  }

  public setDefaultRealtorPhoto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultRealtorPhoto;
  }

  public goToRealtor(realtor: Realtor) {
    if (this.user) {
      this.router.navigateByUrl(`/realtor/${realtor.id}`);
    }
  }

  public addNewRealtor() {
    if (this.user) {
      this.router.navigateByUrl(`/realtor`);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
