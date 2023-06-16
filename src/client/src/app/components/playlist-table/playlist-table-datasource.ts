import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of, Subscription } from 'rxjs';
import { Playlist } from '../models/Playlist.model';
import { HttpService } from '../services/http.service';


/**
 * Data source for the SongTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PlaylistTableDataSource extends DataSource<Playlist> {

  private PlaylistsSubject = new BehaviorSubject<Playlist[]>([]);
  private PlaylistsloadingSubject = new BehaviorSubject<boolean>(false);
  findUserPlaylistsSubs: Subscription;
  searchPlaylistsSubs: Subscription;
  public Playlists$ = this.PlaylistsSubject.asObservable();




  constructor(private _http: HttpService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Playlist[]> {
    return this.PlaylistsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.PlaylistsSubject.complete();
    this.PlaylistsloadingSubject.complete();
  }


  findUserPlaylists(PlaylistId: number, filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
    this.PlaylistsloadingSubject.next(true);
    
    this.findUserPlaylistsSubs = this._http.findUserPlaylists(PlaylistId, filter, sortDirection,
      pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.PlaylistsloadingSubject.next(false))
      )
      .subscribe(Playlists => this.PlaylistsSubject.next(Playlists));
  }

  searchPlaylists(PlaylistId: number, filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
    this.PlaylistsloadingSubject.next(true);
    
    this.searchPlaylistsSubs = this._http.searchPlaylists(PlaylistId, filter, sortDirection,
      pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.PlaylistsloadingSubject.next(false))
      )
      .subscribe(Playlists => this.PlaylistsSubject.next(Playlists));
  }


}
