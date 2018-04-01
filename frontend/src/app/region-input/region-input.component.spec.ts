import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionInputComponent } from './region-input.component';

describe('RegionInputComponent', () => {
  let component: RegionInputComponent;
  let fixture: ComponentFixture<RegionInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
