import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryDownloadSectionComponent } from './itinerary-download-section.component';

describe('ItineraryDownloadSectionComponent', () => {
  let component: ItineraryDownloadSectionComponent;
  let fixture: ComponentFixture<ItineraryDownloadSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryDownloadSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryDownloadSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
