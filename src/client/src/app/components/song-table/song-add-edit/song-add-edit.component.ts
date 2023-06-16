import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SongService } from '../../services/song.service';
import { HttpService } from '../../services/http.service';
import { MatDialogRef } from '@angular/material';
import { Song } from '../../models/song.model';
import { NotificationService } from '../../services/notification.service';
import { SongTableComponent } from '../song-table.component';
import { ChildActivationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-song-add-edit',
  templateUrl: './song-add-edit.component.html',
  styleUrls: ['./song-add-edit.component.scss']
})
export class SongAddEditComponent implements OnInit, OnDestroy {


  subUpdSong: Subscription;
  subInsSong: Subscription;
  subSongDetails : Subscription;
  selected:number=5;
  constructor(public _auth: AuthService,public _song: SongService, public _http: HttpService, public _notification: NotificationService,
    private dialogRef: MatDialogRef<SongAddEditComponent>) { }
  songTableComponent: SongTableComponent;

  ngOnInit() {
  }
  ngOnDestroy(): void {
    if (this.subInsSong) {
      this.subInsSong.unsubscribe();
    }
    if (this.subUpdSong) {
      this.subUpdSong.unsubscribe();
    }
    if (this.subSongDetails) {
      this.subSongDetails.unsubscribe();
    }    
  }

  onClear() {
    this._song.form.reset();
    this._song.initializeFormGroup();
  }

  onSubmit() {

    if (this._song.form.valid) {
      const song: Song = {
        Reviews: null,
        Hidden: false,
        _id: this._song.form.value._id,
        Title: this._song.form.value.title,
        Artist: this._song.form.value.artist,
        Album: this._song.form.value.album,
        Track: this._song.form.value.track,
        Year: this._song.form.value.year,
        Length: this._song.form.value.length,
        Genre: this._song.form.value.genre,
        Rating: null,
        reviewCount: null
      };
      if (this._song.form.get('$key').value != 'modify') {
        this.subInsSong = this._http.insertSong(song).subscribe(
          res => {console.log('hey', res);
          console.log(this.selected);
            this.subSongDetails = this._http.addReview1({ desc: this._song.form.value.review, rating:  this.selected, user_id: this._auth.getUserDetails('user_id'), song_id: res._id }).subscribe(
            res => {
              this._notification.success(':: Submitted successfully');              
            },
            err => console.log('error', err.error)
          );
        },
          err => console.log('error', err.error)
        );
      } else {
        this.subUpdSong = this._http.updateSong(song).subscribe(
          res => {console.log('hey', res)},
          err => console.log('error', err.error)
        );
      }
      this._notification.success(':: Submitted successfully');
      this.songTableComponent.findSongs('');
      this.onClose();
    }
  }

  onClose() {
    this.onClear();
    this.dialogRef.close();
  }
  

}


