import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalDialogComponent } from './cal-dialog.component';

describe('CalDialogComponent', () => {
  let component: CalDialogComponent;
  let fixture: ComponentFixture<CalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
