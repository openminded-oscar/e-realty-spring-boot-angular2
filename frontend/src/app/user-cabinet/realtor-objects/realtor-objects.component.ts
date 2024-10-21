import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealtorService} from '../../services/realtor.service';
import {Subject} from 'rxjs';
import {RealtyObj} from '../../domain/realty-obj';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-realtor-objects',
  templateUrl: './realtor-objects.component.html',
  styleUrls: ['./realtor-objects.component.scss']
})
export class RealtorObjectsComponent implements OnInit, OnDestroy {
  public destroy$ = new Subject<boolean>();
  public realtorObjects: RealtyObj[];

  constructor(public realtorService: RealtorService) {
  }

  ngOnInit(): void {
    this.realtorService.getMyAsRealtorObjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe(objects => {
        this.realtorObjects = objects;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
