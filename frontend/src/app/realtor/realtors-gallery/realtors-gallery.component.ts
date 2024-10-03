import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealterService} from '../../services/realter.service';
import {Realter} from '../../domain/realter';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
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
  public realters: Realter[];
  public defaultRealtorPhoto = 'https://placehold.co/600x400?text=Realtor+photo';
  public user: User;

  constructor(private realterService: RealterService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.realterService.getRealters()
      .subscribe((realters: Realter[]) => {
        this.realters = realters;
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

  public goToRealtor(realter: Realter) {
    if (this.user) {
      this.router.navigateByUrl(`/realtor/${realter.id}`);
    }
  }

  public addNewRealtor() {
    if (this.user) {
      this.router.navigateByUrl(`/realtor`);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
