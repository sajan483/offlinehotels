import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailsPopupComponent } from './room-details-popup.component';

describe('RoomDetailsPopupComponent', () => {
  let component: RoomDetailsPopupComponent;
  let fixture: ComponentFixture<RoomDetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomDetailsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
