import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of, Subscription } from 'rxjs';
import { Song } from '../models/song.model';
import { HttpService } from '../services/http.service';


/**
 * Data source for the SongTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SongTableDataSource extends DataSource<Song> {

  private songsSubject = new BehaviorSubject<Song[]>([]);
  private songsloadingSubject = new BehaviorSubject<boolean>(false);
  findSongsSubs: Subscription;
  topSongsSubs: Subscription;
  loadPlaylistSongsSubs: Subscription;

  public songs$ = this.songsSubject.asObservable();




  constructor(private _http: HttpService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Song[]> {
    return this.songsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.songsSubject.complete();
    this.songsloadingSubject.complete();
  }


  findSongs(songId: number, filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
    this.songsloadingSubject.next(true);

    this.findSongsSubs = this._http.findSongs(songId, filter, sortDirection,
      pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.songsloadingSubject.next(false))
      )
      .subscribe(songs => this.songsSubject.next(songs));
  }

  getTop10Songs() {

    this.songsloadingSubject.next(true);

    this.topSongsSubs = this._http.getTop10Songs().pipe(
      catchError(() => of([])),
      finalize(() => this.songsloadingSubject.next(false))
    )
      .subscribe(songs => this.songsSubject.next(songs));
  }

  loadPlaylistSongs(playlist_id: string, filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 0) {
    this.songsloadingSubject.next(true);
    console.log("hey",playlist_id);

    this.loadPlaylistSongsSubs = this._http.loadPlaylistSongs(playlist_id, filter, sortDirection,
      pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.songsloadingSubject.next(false))
      )
      .subscribe(songs =>
        this.songsSubject.next(songs));
  }

}
