import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLeaderDetailsComponent } from './group-leader-details.component';

describe('GroupLeaderDetailsComponent', () => {
  let component: GroupLeaderDetailsComponent;
  let fixture: ComponentFixture<GroupLeaderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupLeaderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLeaderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
