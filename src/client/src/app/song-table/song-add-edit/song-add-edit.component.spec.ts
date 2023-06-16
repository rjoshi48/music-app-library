import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongAddEditComponent } from './song-add-edit.component';

describe('SongAddEditComponent', () => {
  let component: SongAddEditComponent;
  let fixture: ComponentFixture<SongAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
