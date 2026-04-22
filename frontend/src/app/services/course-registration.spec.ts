import { TestBed } from '@angular/core/testing';

import { CourseRegistration } from './course-registration';

describe('CourseRegistration', () => {
  let service: CourseRegistration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseRegistration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
