import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealterService} from '../../services/realter.service';
import {Realter} from '../../domain/realter';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'realtors-gallery',
  templateUrl: './realtors-gallery.component.html',
  styleUrls: ['./realtors-gallery.component.scss']
})
export class RealtorsGalleryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public realters: Realter[];
  public defaultRealtorPhoto = 'https://placehold.co/600x400?text=Realtor+photo';

  constructor(private realterService: RealterService,
              private router: Router) {
  }

  ngOnInit() {
    this.realterService.getRealters()
      .subscribe((realters: Realter[]) => {
        this.realters = realters;
      });
  }

  public setDefaultRealtorPhoto(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultRealtorPhoto;
  }

  goToRealtor(realter: Realter) {
    this.router.navigateByUrl(`/realtor/${realter.id}`);
  }

  addNewRealtor() {
    this.router.navigateByUrl(`/realtor`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
