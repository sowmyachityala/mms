import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAssetsComponent } from './pending-assets.component';

describe('PendingAssetsComponent', () => {
  let component: PendingAssetsComponent;
  let fixture: ComponentFixture<PendingAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingAssetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
