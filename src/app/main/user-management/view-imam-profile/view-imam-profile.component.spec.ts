import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImamProfileComponent } from './view-imam-profile.component';

describe('ViewImamProfileComponent', () => {
  let component: ViewImamProfileComponent;
  let fixture: ComponentFixture<ViewImamProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewImamProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewImamProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
