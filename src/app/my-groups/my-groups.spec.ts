import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGroups } from './my-groups';

describe('MyGroups', () => {
  let component: MyGroups;
  let fixture: ComponentFixture<MyGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGroups],
    }).compileComponents();

    fixture = TestBed.createComponent(MyGroups);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
