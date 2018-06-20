import { TestBed, inject } from '@angular/core/testing';

import { RealterService } from './realter.service';

describe('RealterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RealterService]
    });
  });

  it('should be created', inject([RealterService], (service: RealterService) => {
    expect(service).toBeTruthy();
  }));
});
