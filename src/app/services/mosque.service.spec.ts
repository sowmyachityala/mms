import { TestBed } from '@angular/core/testing';

import { MosqueService } from './mosque.service';

describe('MosqueService', () => {
  let service: MosqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MosqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
