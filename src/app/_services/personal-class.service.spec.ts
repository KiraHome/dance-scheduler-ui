import { TestBed } from '@angular/core/testing';

import { PersonalClassService } from './personal-class.service';

describe('PersonalClassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PersonalClassService = TestBed.get(PersonalClassService);
    expect(service).toBeTruthy();
  });
});
