
import { Component, OnInit, ViewChild, OnDestroy, Inject, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { HttpService } from '../../services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Song } from '../../models/song.model';
import { NotificationService } from '../../services/notification.service';
import { ChildActivationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Playlist } from 'src/app/models/Playlist.model';
import { PlaylistTableComponent } from '../playlist-table.component';

@Component({
  selector: 'app-playlist-add-edit',
  templateUrl: './playlist-add-edit.component.html',
  styleUrls: ['./playlist-add-edit.component.css']
})
export class PlaylistAddEditComponent implements OnInit, OnDestroy {

  selected: string = 'private';
  subInsSong: Subscription;
  subUpdSong: Subscription;
  subSongDetails: Subscription;
  song: Song;
  playlist_id: string;
  action: string;
  panelOpenState = true;
  module = 'Create ';

  constructor(public _auth: AuthService, public _playlist: PlaylistService, public _http: HttpService, public _notification: NotificationService,
    private dialogRef: MatDialogRef<PlaylistAddEditComponent>, @Inject(MAT_DIALOG_DATA) data: any) { 
      this.song = data.song; 
      this.module = data.module;
      _playlist.module=data.module;    
      _playlist.song=data.song;         
      this.playlist_id=this._playlist.form.value._id    
     }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this._playlist.module='default';
    this._playlist.song=null;
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
    if (this._playlist.form.get('$key').value == 'modify' && this._playlist.form.value._id != '') {
      this.playlist_id = this._playlist.form.value._id;
      this.action = 'modify';
    }
    else {
      this.action = null;
    }
    this._playlist.form.reset();
    this._playlist.initializeFormGroup();

  }

  onClose() {
    this.onClear();
    this.dialogRef.close();
  }

  onSubmit() {

    if (this._playlist.form.valid) {
      const playlist: Playlist = {
        visiblity: this._playlist.form.value.visiblity,
        _id: this._playlist.form.value._id,
        playlist_title: this._playlist.form.value.playlist_title,
        playlist_desc: this._playlist.form.value.playlist_desc,
        user_id: this._auth.getUserDetails('user_id'),
        songs: this._playlist.form.value.song
      };

      if (this._playlist.form.get('$key').value != 'modify' && this.action != 'modify') {
        playlist.songs = this.song._id;
        this._http.insertPlaylist(playlist).subscribe(
          res => { console.log('success', res); },
          err => console.log('error', err.error)
        );        
      } else {
      
        if (playlist._id != '') {
          playlist._id = this.playlist_id;
        }
        this._http.updatePlaylist(playlist).subscribe(
          res => { console.log('success', res); },
          err => console.log('error', err.error)
        );
      }
      this._notification.success(':: Submitted successfully');
      this.onClose();

    }
  }


}
