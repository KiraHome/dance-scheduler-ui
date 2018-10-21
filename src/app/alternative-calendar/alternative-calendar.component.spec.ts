import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeCalendarComponent } from './alternative-calendar.component';

describe('AlternativeCalendarComponent', () => {
  let component: AlternativeCalendarComponent;
  let fixture: ComponentFixture<AlternativeCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternativeCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
