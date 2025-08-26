import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhutbahJumatComponent } from './khutbah-jumat.component';

describe('KhutbahJumatComponent', () => {
  let component: KhutbahJumatComponent;
  let fixture: ComponentFixture<KhutbahJumatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhutbahJumatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhutbahJumatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
