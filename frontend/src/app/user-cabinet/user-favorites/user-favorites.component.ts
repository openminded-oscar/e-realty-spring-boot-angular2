import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';
import {InterestService} from '../../services/interest.service';
import {Interest} from '../../domain/interest';
import {RealtyObj} from '../../domain/realty-obj';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss']
})
export class UserFavoritesComponent implements OnInit, OnDestroy {
  public interests: Interest[] = [];
  public interestMappedObjects: RealtyObj[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(public interestService: InterestService) {
  }

  ngOnInit(): void {
    this.interestService.getAllInterestsForUser()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(interestsResponse => {
        this.interests = interestsResponse.body;
        this.interestMappedObjects = this.interests.map(interest => interest.realtyObj);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
