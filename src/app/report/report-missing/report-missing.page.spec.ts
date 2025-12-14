import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportMissingPage } from './report-missing.page';

describe('ReportMissingPage', () => {
  let component: ReportMissingPage;
  let fixture: ComponentFixture<ReportMissingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMissingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
