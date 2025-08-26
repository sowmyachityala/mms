import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonatonPurposeComponent } from './donaton-purpose.component';

describe('DonatonPurposeComponent', () => {
  let component: DonatonPurposeComponent;
  let fixture: ComponentFixture<DonatonPurposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonatonPurposeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonatonPurposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
