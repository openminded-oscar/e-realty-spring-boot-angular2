import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {
  MyFavoritesTabPath,
  MyObjectsTabPath,
  MyReviewsTabPath,
  RealtorObjectsTabPath,
  RealtorReviewsTabPath
} from '../utils';
import {ReviewsService} from '../../app-services/reviews.service';
import {InterestService} from '../../app-services/interest.service';
import {UserService} from '../../app-services/user.service';
import {takeUntil} from 'rxjs/operators';
import {BehaviorSubject, from, Subject} from 'rxjs';


@Component({
  selector: 'app-user-cabinet-container',
  templateUrl: './user-cabinet-container.component.html',
  styleUrls: ['./user-cabinet-container.component.scss']
})
export class UserCabinetContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  @ViewChild(NgbNav, {static: true})
  public ngbNav: NgbNav;
  public activeLinksSubject = new BehaviorSubject([]);
  public activeLinks$ = from(this.activeLinksSubject);
  public realtorLinks = [
    {title: 'Realtor Objects', route: RealtorObjectsTabPath},
    {title: 'Realtor Reviews', route: RealtorReviewsTabPath},
  ];
  public userLinks = [
    {title: 'My Objects', route: MyObjectsTabPath},
    {title: 'My Reviews', route: MyReviewsTabPath},
    {title: 'My Favorites', route: MyFavoritesTabPath},
  ];

  constructor(public reviewsService: ReviewsService,
              public userService: UserService,
              public route: ActivatedRoute,
              public interestsService: InterestService) {
  }

  ngOnInit(): void {
    this.interestsService.getAllInterestsForUser().subscribe();
    this.reviewsService.getAllReviewsForUser().subscribe();

    this.userService.isRealtor$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRealtor => {
        if (isRealtor) {
          this.activeLinksSubject.next([...this.realtorLinks, ...this.userLinks]);
        } else {
          this.activeLinksSubject.next([...this.userLinks]);
        }
      });

    this.route.firstChild.url.subscribe((url) => {
      const urlPath = url[url.length - 1]?.path;
      this.ngbNav.select(urlPath);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
