import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistAddEditComponent } from './playlist-add-edit.component';

describe('PlaylistAddEditComponent', () => {
  let component: PlaylistAddEditComponent;
  let fixture: ComponentFixture<PlaylistAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
