import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtyObjsGalleryComponent } from './realty-objs-gallery.component';

describe('RealtyObjsGalleryComponent', () => {
  let component: RealtyObjsGalleryComponent;
  let fixture: ComponentFixture<RealtyObjsGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtyObjsGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtyObjsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
