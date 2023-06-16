import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Review } from '../../models/review.model';
import { HttpService } from '../../services/http.service';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {
  reviews: Review[];
  subscription: Subscription;
  song: Song;
  constructor(private _http: HttpService, @Inject(MAT_DIALOG_DATA) data: Song) { this.song = data; }

  ngOnInit() {
    this.subscription = this._http.getReviews(this.song._id).subscribe(data => {
      this.reviews = data;
      console.log(data);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
