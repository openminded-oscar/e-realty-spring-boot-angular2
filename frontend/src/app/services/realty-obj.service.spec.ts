import { TestBed, inject } from '@angular/core/testing';

import { RealtyObjServiceService } from './realty-obj.service';

describe('RealtyObjServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealtyObjServiceService]
    });
  });

  it('should be created', inject([RealtyObjServiceService], (service: RealtyObjServiceService) => {
    expect(service).toBeTruthy();
  }));
});
