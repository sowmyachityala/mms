import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedDashboardComponent } from './routed-dashboard.component';

describe('RoutedDashboardComponent', () => {
  let component: RoutedDashboardComponent;
  let fixture: ComponentFixture<RoutedDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutedDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
