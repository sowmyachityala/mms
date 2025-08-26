import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueDashboardComponent } from './mosque-dashboard.component';

describe('MosqueDashboardComponent', () => {
  let component: MosqueDashboardComponent;
  let fixture: ComponentFixture<MosqueDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosqueDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MosqueDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
