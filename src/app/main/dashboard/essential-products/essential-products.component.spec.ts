import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialProductsComponent } from './essential-products.component';

describe('EssentialProductsComponent', () => {
  let component: EssentialProductsComponent;
  let fixture: ComponentFixture<EssentialProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EssentialProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EssentialProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
