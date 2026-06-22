import {ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RealtyObj} from '../../app-models/realty-obj';
import {UserService} from '../../app-services/user.service';

@Component({
  selector: 'app-realty-obj-card',
  templateUrl: './realty-obj-card.component.html',
  styleUrl: './realty-obj-card.component.scss'
})
export class RealtyObjCardComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  @Input() showManageStatusOptions!: boolean;
  @Input() showCreatedAt!: boolean;
  @Input() realtyObject!: RealtyObj;
  public isMyObject: boolean;

  constructor(public userService: UserService,
              public cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.userService.user$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((user) => {
      let currentUserObjects = [];
      if (user) {
        currentUserObjects = user.realtyObjects;
      }
      this.isMyObject = !!currentUserObjects?.find((obj) => obj.id === this.realtyObject.id);
      this.cdr.detectChanges();
    });
  }
}
