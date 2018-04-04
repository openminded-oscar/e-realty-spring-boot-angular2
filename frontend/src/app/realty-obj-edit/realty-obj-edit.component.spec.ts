import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtyObjEditComponent } from './realty-obj-edit.component';

describe('RealtyObjEditComponent', () => {
  let component: RealtyObjEditComponent;
  let fixture: ComponentFixture<RealtyObjEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtyObjEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtyObjEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
