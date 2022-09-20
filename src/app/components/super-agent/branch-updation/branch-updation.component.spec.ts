import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchUpdationComponent } from './branch-updation.component';

describe('BranchUpdationComponent', () => {
  let component: BranchUpdationComponent;
  let fixture: ComponentFixture<BranchUpdationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchUpdationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
