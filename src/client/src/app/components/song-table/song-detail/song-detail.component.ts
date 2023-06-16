import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { Song } from '../../models/song.model';
import { Subscription } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ReviewComponent } from '../review/review.component';
import { AddReviewComponent } from '../add-review/add-review.component';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit, AfterViewInit, OnDestroy {
 
text:string="";
  songDetails: Song={Reviews:[],Hidden:false,_id:'',Title:'',Artist:'',Album:'',Track:0,Year:0,Length:0,Genre:'',Rating:0,reviewCount:0};
  constructor(private _song: SongService,public _playlist: PlaylistService, private _auth: AuthService, private _http: HttpService, private dialog: MatDialog) { 
  if(_song.songDetails!=null)
    this.songDetails=_song.songDetails;
  }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    
  }
  ngOnDestroy(): void {
  }

  loadSongDetails() {   
    this.songDetails=this._song.songDetails;   
  
  }
  addReviewDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose=true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = this.songDetails;
    this._song.addReviewDialog(dialogConfig).subscribe(data => {
    this._http.getSongDetails(this.songDetails).subscribe(
        res => { this.songDetails = res;console.log(res)},
        err => console.log('error', err.error)
      );    
    });

  }


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose=true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = this.songDetails;
    this.dialog.open(ReviewComponent, dialogConfig);
  }

}
