import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchHeaderComponent } from './branch-header.component';

describe('BranchHeaderComponent', () => {
  let component: BranchHeaderComponent;
  let fixture: ComponentFixture<BranchHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
