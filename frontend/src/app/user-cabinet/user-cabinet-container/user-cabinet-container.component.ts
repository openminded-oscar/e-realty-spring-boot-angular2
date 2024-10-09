import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {MyFavoritesTabPath, MyObjectsTabPath, MyReviewsTabPath} from '../utils';
import {ReviewsService} from '../../services/reviews.service';
import {InterestService} from '../../services/interest.service';


@Component({
  selector: 'app-user-cabinet-container',
  templateUrl: './user-cabinet-container.component.html',
  styleUrls: ['./user-cabinet-container.component.scss']
})
export class UserCabinetContainerComponent implements OnInit {
  @ViewChild(NgbNav, {static: true})
  public ngbNav: NgbNav;
  public links = [
    { title: 'My Objects', route: MyObjectsTabPath },
    { title: 'My Reviews', route: MyReviewsTabPath },
    { title: 'My Favorites', route: MyFavoritesTabPath },
  ];

  constructor(public reviewsService: ReviewsService,
              public route: ActivatedRoute,
              public interestsService: InterestService) { }

  ngOnInit(): void {
    this.interestsService.getAllInterestsForUser().subscribe();
    this.reviewsService.getAllReviewsForUser().subscribe();

    this.route.firstChild.url.subscribe((url) => {
      const urlPath = url[url.length - 1]?.path;
      this.ngbNav.select(urlPath);
    });
  }
}
