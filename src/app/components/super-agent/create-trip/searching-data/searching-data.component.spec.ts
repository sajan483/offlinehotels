import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchingDataComponent } from './searching-data.component';

describe('SearchingDataComponent', () => {
  let component: SearchingDataComponent;
  let fixture: ComponentFixture<SearchingDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchingDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
