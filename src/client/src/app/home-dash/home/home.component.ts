import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SongTableComponent } from '../../song-table/song-table.component';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../../services/song.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SongAddEditComponent } from 'src/app/song-table/song-add-edit/song-add-edit.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild(SongTableComponent, { static: false }) child: SongTableComponent;

  sub: Subscription;
  search: string;
  constructor(private dialog: MatDialog, public _auth: AuthService, public _song: SongService) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    // server-side search
    this.sub = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.child.findSongs(this.input.nativeElement.value);
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onCreate() {
    this._song.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(SongAddEditComponent, dialogConfig);
  }


}
