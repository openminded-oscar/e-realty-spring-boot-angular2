import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtyObjsListComponent } from './realty-objs-list.component';

describe('RealtyObjsListComponent', () => {
  let component: RealtyObjsListComponent;
  let fixture: ComponentFixture<RealtyObjsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtyObjsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtyObjsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
