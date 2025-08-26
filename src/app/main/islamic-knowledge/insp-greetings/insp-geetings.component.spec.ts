import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspGeetingsComponent } from './insp-geetings.component';

describe('InspGeetingsComponent', () => {
  let component: InspGeetingsComponent;
  let fixture: ComponentFixture<InspGeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspGeetingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspGeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
