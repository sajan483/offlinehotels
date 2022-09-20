import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAllocationPopupsComponent } from './room-allocation-popups.component';

describe('RoomAllocationPopupsComponent', () => {
  let component: RoomAllocationPopupsComponent;
  let fixture: ComponentFixture<RoomAllocationPopupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAllocationPopupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAllocationPopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
