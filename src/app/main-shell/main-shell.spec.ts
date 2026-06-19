import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainShell } from './main-shell';

describe('MainShell', () => {
  let component: MainShell;
  let fixture: ComponentFixture<MainShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainShell],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
