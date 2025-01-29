import { TestBed } from '@angular/core/testing';

import { AiWebSocketService } from './ai-web-socket.service';

describe('AiWebSocketService', () => {
  let service: AiWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
