import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XendittransactionsComponent } from './xendittransactions.component';

describe('XendittransactionsComponent', () => {
  let component: XendittransactionsComponent;
  let fixture: ComponentFixture<XendittransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XendittransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XendittransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
