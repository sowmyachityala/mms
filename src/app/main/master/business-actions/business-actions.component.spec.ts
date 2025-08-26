import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessActionsComponent } from './business-actions.component';

describe('BusinessActionsComponent', () => {
  let component: BusinessActionsComponent;
  let fixture: ComponentFixture<BusinessActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
