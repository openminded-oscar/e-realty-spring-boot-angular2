import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RealtorService} from '../../app-services/realtor.service';
import {RealtyObj} from '../../app-models/realty-obj';

@Component({
  selector: 'app-realtor-objects',
  templateUrl: './realtor-objects.component.html',
  styleUrls: ['./realtor-objects.component.scss']
})
export class RealtorObjectsComponent implements OnInit, OnDestroy {
  public destroy$ = new Subject<boolean>();
  public realtorObjects: RealtyObj[];
  public filter: 'all' | 'active' | 'archived' | 'drafts' = 'all';

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

  public setFilter(filterSelected: 'all' | 'active' | 'archived' | 'drafts') {
    this.filter = filterSelected;
  }
}
