import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ItemsService, Item } from './items.service';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsService]
    });

    service = TestBed.inject(ItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items from API', () => {
    const mockItems: Item[] = [
      { id: 1, name: 'Test Item 1', description: 'Description 1' },
      { id: 2, name: 'Test Item 2', description: 'Description 2' }
    ];

    service.getItems().subscribe(items => {
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne('http://localhost:3001/api/items');
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should handle empty items response', () => {
    const mockItems: Item[] = [];

    service.getItems().subscribe(items => {
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne('http://localhost:3001/api/items');
    req.flush(mockItems);
  });
});
