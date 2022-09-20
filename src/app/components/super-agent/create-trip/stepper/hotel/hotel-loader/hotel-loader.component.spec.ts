import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelLoaderComponent } from './hotel-loader.component';

describe('HotelLoaderComponent', () => {
  let component: HotelLoaderComponent;
  let fixture: ComponentFixture<HotelLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
