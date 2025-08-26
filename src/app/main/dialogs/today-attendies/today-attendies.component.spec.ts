import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodayAttendiesComponent } from './today-attendies.component';


describe('TodayAttendiesComponent', () => {
  let component: TodayAttendiesComponent;
  let fixture: ComponentFixture<TodayAttendiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayAttendiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayAttendiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
