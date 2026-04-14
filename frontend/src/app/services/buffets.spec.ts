import { TestBed } from '@angular/core/testing';

import { Buffets } from './buffets';

describe('Buffets', () => {
  let service: Buffets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Buffets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
