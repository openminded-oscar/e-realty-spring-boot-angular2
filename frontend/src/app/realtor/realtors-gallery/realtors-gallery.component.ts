import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealtorService} from '../../app-services/realtor.service';
import {Realtor} from '../../app-models/realtor';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {UserService} from '../../app-services/user.service';
import {takeUntil} from 'rxjs/operators';
import {User} from '../../app-models/user';
import * as L from 'leaflet';

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

  options: any = {
    zoomControl: false,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 4,
        attribution: '...',
      }),
    ],
    zoom: 2,
    center: L.latLng({ lat: 38.991709, lng: -76.886109 }),
  };

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

  mapReady(map) {
    map.addControl(L.control.zoom({ position: 'bottomright' }));
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
