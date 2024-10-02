import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCabinetContainerComponent } from './user-cabinet-container.component';

describe('UserCabinetContainerComponent', () => {
  let component: UserCabinetContainerComponent;
  let fixture: ComponentFixture<UserCabinetContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCabinetContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCabinetContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
