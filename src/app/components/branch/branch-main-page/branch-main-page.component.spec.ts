import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMainPageComponent } from './branch-main-page.component';

describe('BranchMainPageComponent', () => {
  let component: BranchMainPageComponent;
  let fixture: ComponentFixture<BranchMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
