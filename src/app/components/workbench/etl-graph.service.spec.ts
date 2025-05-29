import { TestBed } from '@angular/core/testing';

import { EtlGraphService } from './etl-graph.service';

describe('EtlGraphService', () => {
  let service: EtlGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtlGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
