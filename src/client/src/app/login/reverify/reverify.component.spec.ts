import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverifyComponent } from './reverify.component';

describe('ReverifyComponent', () => {
  let component: ReverifyComponent;
  let fixture: ComponentFixture<ReverifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReverifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
