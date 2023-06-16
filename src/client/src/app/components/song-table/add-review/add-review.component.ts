import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Song } from '../../models/song.model';
import { Review } from '../../models/review.model';
import { User } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
//import { SongService } from '../../services/song.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
//import { SongDetailComponent } from '../song-detail/song-detail.component';


@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit, OnDestroy {

  song: Song;
  user: User;
  selected = 5;
  sub: Subscription;
  subSongDetails: Subscription;
  songDetails: Object = new Object();
  reviewObj: Review = { desc: '', rating: 0, user_id: this.user, song_id: '' };
  // songDetailComponent: SongDetailComponent;

  @ViewChild('rating', { static: false }) rating: ElementRef;
  @ViewChild('review', { static: false }) review: ElementRef;


  ratingFormControl = new FormControl('', [
    Validators.required
  ]);

  reviewFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[ '.()\p{L}\p{N}]+$/u)

  ]);
  constructor(@Inject(MAT_DIALOG_DATA) data: Song,private _auth: AuthService, private dialogRef: MatDialogRef<AddReviewComponent>, private _http: HttpService, private _notification: NotificationService) {
    this.song = data;

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSubmit() {

    this.subSongDetails = this._http.addReview1({ desc: this.review.nativeElement.value, rating: this.selected, user_id: this._auth.getUserDetails('user_id'), song_id: this.song._id }).subscribe(
      res => {
        this._notification.success(':: Submitted successfully');
        this.subSongDetails = this._http.getSongDetails(this.song).subscribe(
          res => { this.songDetails = res; this.dialogRef.close(); },
          err => console.log('error', err.error)
        );
      },
      err => console.log('error', err.error)
    );

  }

}
