import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMissingPage } from './add-missing.page';

describe('AddMissingPage', () => {
  let component: AddMissingPage;
  let fixture: ComponentFixture<AddMissingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMissingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
