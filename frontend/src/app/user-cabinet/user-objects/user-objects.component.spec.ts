import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserObjectsComponent } from './user-objects.component';

describe('UserObjectsComponent', () => {
  let component: UserObjectsComponent;
  let fixture: ComponentFixture<UserObjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserObjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
