import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren, OnDestroy, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PlaylistTableDataSource } from './playlist-table-datasource';

import { HttpService } from '../services/http.service';
import { SongService } from '../services/song.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription, Subject, fromEvent } from 'rxjs';
import { ReviewComponent } from '../song-table/review/review.component';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { SongTableComponent } from '../song-table/song-table.component';
import { AuthService } from '../services/auth.service';
import { PlaylistService } from '../services/playlist.service';
import { NotificationService } from '../services/notification.service';
import { Playlist } from '../models/Playlist.model';

@Component({
  selector: 'app-playlist-table',
  templateUrl: './playlist-table.component.html',
  styleUrls: ['./playlist-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PlaylistTableComponent implements AfterViewInit, OnInit, OnDestroy {
  module:string;

  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChildren(SongTableComponent) SongTableComponentList: QueryList<SongTableComponent>;
  dataSource: PlaylistTableDataSource;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  columnsToDisplay = ['playlist_title', 'playlist_desc',' '];
  expandedElement: Playlist | null;

  constructor(public _notification: NotificationService,public _auth: AuthService,public _playlist: PlaylistService,public _http: HttpService, private dialog: MatDialog, private elementRef: ElementRef, private _song: SongService) {
    this._song.module = 'playlist';
    if(_playlist.module!='Create')
    {
      _playlist.sub_module='playlist';
    }
 
    console.log(_playlist.sub_module);
  }


  ngOnInit() {
    this.dataSource = new PlaylistTableDataSource(this._http);
    this.dataSource.findUserPlaylists(1, this._auth.getUserDetails('user_id'), '', 0, 0);//replace

  }

  ngAfterViewInit() {
    // server-side search
    if( this._playlist.module=='default'){
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.searchPlaylist();
        })
      )
      .subscribe();
    }
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this._playlist.sub_module='default';
    this._playlist.playlist_id=null;
    this._song.module = null;
    if (this.dataSource.findUserPlaylistsSubs) {
      this.dataSource.findUserPlaylistsSubs.unsubscribe();

    }
    if (this.dataSource.searchPlaylistsSubs) {
      this.dataSource.searchPlaylistsSubs.unsubscribe();

    }

  }

  
  // onCreate() {
  //   this._playlist.initializeFormGroup();
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = '60%';
  //   this._playlist.playlistDialog(dialogConfig).subscribe(data => {
  //     for(let i=0;i<=3;i++){
  //     this.searchPlaylist();      
  //     }
  //     });
  // }


  loadPlaylistSongs(expandedElement) {
    this._playlist.playlist_id=expandedElement._id;
    if (expandedElement) {
      this.SongTableComponentList.forEach(instance => {
        instance.loadPlaylistSongs(expandedElement._id);
      });
    }
  }

  searchPlaylist() {
    if (this.input.nativeElement.value !== '') {
      this.dataSource.searchPlaylists(
        1,
        this.input.nativeElement.value,
        '',
        0,
        0);
    } else {
      this.dataSource.findUserPlaylists(
        1,
        this._auth.getUserDetails('user_id'),
        '',
        0,
        0);
    }
  }

  reloadPlaylist() {
      this.dataSource.findUserPlaylists(
        1,
        this._auth.getUserDetails('user_id'),
        '',
        0,
        0);
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  openDialog(element) {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose=true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = element;
    this.dialog.open(ReviewComponent, dialogConfig);
  }

  
  onEdit(row) {
    this._playlist.populateForm(row);
    if(row.user_id!=this._auth.getUserDetails('user_id'))
    {
      this._notification.warn(':: Do not have permission to modify playlist created by other users');
    }else{
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = {module: 'Edit'};
     this._playlist.playlistDialog(dialogConfig).subscribe(data => {
      for(let i=0;i<=3;i++){
        this.reloadPlaylist();      
        }          
      });
    }
    
  }

  addSongToPlaylist(row){
    this._http.updatePlaylist({_id:row._id, add_remove_mode:'add', song_id: this._playlist.song._id}).subscribe(
      res => { console.log('success', res); },
      err => console.log('error', err.error)
    );

    this._notification.success(':: Song Added to playlist successfully');


  }

}
