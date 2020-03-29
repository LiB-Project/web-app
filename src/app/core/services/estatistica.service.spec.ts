import { TestBed } from '@angular/core/testing';

import { EstatisticaService } from './estatistica.service';

describe('EstatisticaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstatisticaService = TestBed.get(EstatisticaService);
    expect(service).toBeTruthy();
  });
});
