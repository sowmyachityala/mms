import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyHadithComponent } from './daily-hadith.component';

describe('DailyHadithComponent', () => {
  let component: DailyHadithComponent;
  let fixture: ComponentFixture<DailyHadithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyHadithComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyHadithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
