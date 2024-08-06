import { TestBed } from '@angular/core/testing';

import { ViewTemplateDrivenService } from './view-template-driven.service';

describe('ViewTemplateDrivenService', () => {
  let service: ViewTemplateDrivenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewTemplateDrivenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
