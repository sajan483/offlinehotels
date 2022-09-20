import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MofaLoginsComponent } from './mofa-logins.component';

describe('MofaLoginsComponent', () => {
  let component: MofaLoginsComponent;
  let fixture: ComponentFixture<MofaLoginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MofaLoginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MofaLoginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
