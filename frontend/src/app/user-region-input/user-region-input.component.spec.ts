import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegionInputComponent } from './user-region-input.component';

describe('UserRegionInputComponent', () => {
  let component: UserRegionInputComponent;
  let fixture: ComponentFixture<UserRegionInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRegionInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
