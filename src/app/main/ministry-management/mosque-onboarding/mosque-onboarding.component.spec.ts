import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueOnboardingRequestComponent } from './mosque-onboarding.component';

describe('MosqueOnboardingRequestComponent', () => {
  let component: MosqueOnboardingRequestComponent;
  let fixture: ComponentFixture<MosqueOnboardingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosqueOnboardingRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqueOnboardingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
