import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePrintComponent } from './qrcode-print.component';

describe('QrcodePrintComponent', () => {
  let component: QrcodePrintComponent;
  let fixture: ComponentFixture<QrcodePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
