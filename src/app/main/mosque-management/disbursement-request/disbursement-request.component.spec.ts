import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementRequestComponent } from './disbursement-request.component';

describe('DisbursementRequestComponent', () => {
  let component: DisbursementRequestComponent;
  let fixture: ComponentFixture<DisbursementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisbursementRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisbursementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
