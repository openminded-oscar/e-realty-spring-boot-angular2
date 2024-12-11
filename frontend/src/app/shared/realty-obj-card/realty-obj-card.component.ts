import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {RealtyObj} from '../../app-models/realty-obj';
import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'app-realty-obj-card',
  templateUrl: './realty-obj-card.component.html',
  styleUrl: './realty-obj-card.component.scss'
})
export class RealtyObjCardComponent implements OnInit, OnDestroy {
  @Input() showManageStatusOptions!: boolean;
  @Input() showCreatedAt!: boolean;
  @Input() realtyObject!: RealtyObj;
  public isMyObject: boolean;

  private destroy$ = new Subject<boolean>();

  constructor(public userService: UserService,
              public cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.userService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((user) => {
      let currentUserObjects = [];
      if (user) {
        currentUserObjects = user.realtyObjects;
      }
      this.isMyObject = !!currentUserObjects?.find((obj) => obj.id === this.realtyObject.id);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
