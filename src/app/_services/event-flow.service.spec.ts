import { TestBed } from '@angular/core/testing';

import { EventFlowService } from './event-flow.service';

describe('EventFlowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventFlowService = TestBed.get(EventFlowService);
    expect(service).toBeTruthy();
  });
});
