import {Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, from} from 'rxjs';
import {
  MyFavoritesTabPath,
  MyObjectsTabPath,
  MyReviewsTabPath,
  RealtorObjectsTabPath,
  RealtorReviewsTabPath
} from '../routes';
import {ReviewsService} from '../../app-services/reviews.service';
import {InterestService} from '../../app-services/interest.service';
import {UserService} from '../../app-services/user.service';
import {RealtorService} from '../../app-services/realtor.service';


@Component({
  selector: 'app-user-cabinet-container',
  templateUrl: './user-cabinet-container.component.html',
  styleUrls: ['./user-cabinet-container.component.scss']
})
export class UserCabinetContainerComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
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
              public realtorService: RealtorService,
              public route: ActivatedRoute,
              public interestsService: InterestService) {
  }

  ngOnInit(): void {
    this.interestsService.getAllInterestsForUser().subscribe();
    this.reviewsService.getAllReviewsForUser().subscribe();

    this.userService.isRealtor$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isRealtor => {
        if (isRealtor) {
          this.reviewsService.getMyAsRealtorReviews().subscribe();
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
}
