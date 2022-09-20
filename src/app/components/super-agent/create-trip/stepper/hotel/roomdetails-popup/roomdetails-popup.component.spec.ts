import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomdetailsPopupComponent } from './roomdetails-popup.component';

describe('RoomdetailsPopupComponent', () => {
  let component: RoomdetailsPopupComponent;
  let fixture: ComponentFixture<RoomdetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomdetailsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomdetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
