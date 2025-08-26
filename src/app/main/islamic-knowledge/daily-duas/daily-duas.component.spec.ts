import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDuasComponent } from './daily-duas.component';

describe('DailyDuasComponent', () => {
  let component: DailyDuasComponent;
  let fixture: ComponentFixture<DailyDuasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyDuasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDuasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
