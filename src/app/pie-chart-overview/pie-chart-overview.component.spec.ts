import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartOverviewComponent } from './pie-chart-overview.component';

describe('PieChartOverviewComponent', () => {
  let component: PieChartOverviewComponent;
  let fixture: ComponentFixture<PieChartOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
