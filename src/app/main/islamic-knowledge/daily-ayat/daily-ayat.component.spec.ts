import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAyatComponent } from './daily-ayat.component';

describe('DailyAyatComponent', () => {
  let component: DailyAyatComponent;
  let fixture: ComponentFixture<DailyAyatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyAyatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyAyatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
