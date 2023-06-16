import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Song } from '../models/song.model';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { AddReviewComponent } from '../song-table/add-review/add-review.component';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  module: string;
  songDetails: Song;

  titleFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[ '.()\p{L}\p{N}]+$/u)

  ]);

  artistFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[ ,'.()\p{L}\p{N}]+$/u)

  ]);

  albumFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[ :'.()\p{L}\p{N}]+$/u)

  ]);

  yearFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.pattern('[0-9 ]*'),
    Validators.min(1950),
    Validators.max(2019)
  ]);

  genreFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[ ,\p{L}\p{N}]+$/u)

  ]);

  trackFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.pattern('[0-9 ]*'),
    Validators.min(1),
    Validators.max(999)
  ]);


  lengthFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.pattern('[0-9 ]*'),
    Validators.min(1),
    Validators.max(9999)
  ]);


  reviewFormControl = new FormControl('', [
    Validators.minLength(3),
    Validators.pattern(/^[ '.()\p{L}\p{N}]+$/u)
  ]);

  constructor(public dialog: MatDialog) { }

  addReviewDialog(dialogConfig): Observable<any> {

    const dialogRef = this.dialog.open(AddReviewComponent, dialogConfig);

    return dialogRef.afterClosed();
  }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    _id: new FormControl(null),
    title: this.titleFormControl,
    artist: this.artistFormControl,
    album: this.albumFormControl,
    year: this.yearFormControl,
    genre: this.genreFormControl,
    track: this.trackFormControl,
    length: this.lengthFormControl,
    rating: new FormControl(null),
    review: this.reviewFormControl
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      _id: '',
      title: '',
      artist: '',
      album: '',
      year: '',
      genre: '',
      track: '',
      length: '',
      rating: '',
      review: ''
    });
  }

  populateForm(song) {
    this.form.setValue({
      $key: 'modify',
      _id: song._id,
      title: song.Title,
      artist: song.Artist,
      album: song.Album,
      year: song.Year,
      genre: song.Genre,
      track: song.Track,
      length: song.Length,    
      rating : null,
      review :null  
    });
  }

  populateSongModel(song) {
    this.songDetails = song;
  }

}
