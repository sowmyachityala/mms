import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueQrcodeComponent } from './mosque-qrcode.component';

describe('MosqueQrcodeComponent', () => {
  let component: MosqueQrcodeComponent;
  let fixture: ComponentFixture<MosqueQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosqueQrcodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqueQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
