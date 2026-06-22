import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {RealtorService} from '../../app-services/realtor.service';
import {Realtor} from '../../app-models/realtor';
import {UserService} from '../../app-services/user.service';
import {User} from '../../app-models/user';

@Component({
  selector: 'realtors-gallery',
  templateUrl: './realtors-gallery.component.html',
  styleUrls: ['./realtors-gallery.component.scss']
})
export class RealtorsGalleryComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
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
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(user => {
      this.user = user;
    });
  }

  public setDefaultRealtorPhoto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultRealtorPhoto;
  }
}
