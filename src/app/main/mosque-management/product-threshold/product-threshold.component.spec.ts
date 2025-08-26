import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductThresholdComponent } from './product-threshold.component';

describe('ProductThresholdComponent', () => {
  let component: ProductThresholdComponent;
  let fixture: ComponentFixture<ProductThresholdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductThresholdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductThresholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
