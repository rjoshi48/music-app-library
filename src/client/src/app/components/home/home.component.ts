import { HttpService } from './../../services/http.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';

export interface Tracks {
  track_title: string;
  album_title: string;
  artist_name: string;
  genere: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {

  searchInput: string = '';
  myControl = new FormControl('');
  searchTerm = '';
  showTable: boolean = false;

  toggleRow(element: { expanded: boolean; }) {
    element.expanded = !element.expanded
  }

  displayedColumns: string[] = ['Track Name', 'Artist Name'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<Tracks>();
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  elementsDisplayed: string[] = ['track_title', 'artist_name'];

  expandedElement: Tracks | null | undefined;

  @Output() loginEmitter: EventEmitter<any> = new EventEmitter();
  @Output() home: EventEmitter<any> = new EventEmitter();

  loggedInUser: string = 'Guest'
  loggedIn: boolean = false; 

  constructor(private router: Router,private httpService: HttpService) { }

  ngOnInit(): void {
  }

  filterTracks(searchTerm: string){
    this.httpService.fetchTrackDetails(searchTerm.trim()).subscribe((resp: any) =>{
      if(resp.error){
        setTimeout(() => {alert(resp.error);}, 1000);
      } else{
        console.log(resp);
        isExpanded: false
        this.dataSource = new MatTableDataSource(resp);
      }
    })
  }

  toggleShowTable(): void {
    this.showTable = !this.showTable;
}

  fetchAllTracks(){

  }

  playlistHandler(){

  }

  fetchAllPlaylists(){

  }

  modifyPlaylist(){

  }

  searchObjects(event: any) {
  }

  globalSearch(input: any, event: any) {
  }

  resetSearch(value: string, event: any) {
    // this.enableCheckBox = false;
    event.stopPropagation();
    // trigger.closePanel();

    this.searchInput = '';
  }


  homeHandler(tab: string) {
    this.home.emit(true)
    this.router.navigate(['/home']);
    
  }

  loginHandler(tab: string) {
    // this.tabEmitter.emit(tab)
    this.router.navigate(['/login']);

  }
  aboutHandler(tab: string) {
    // this.tabEmitter.emit(tab)
    this.router.navigate(['/about']);
    
  }

  logoutHandler(tab: string) {
    this.loggedInUser = 'Guest';  
    this.loggedIn = false;
    this.home.emit(true)
    this.router.navigate(['/home']);
    
  }

  adminHandler(tab: string) {
    // this.tabEmitter.emit(tab)
    this.router.navigate(['/admins']);
    
  }

  registerAdmin(tab: string) {
    // this.tabEmitter.emit(tab)
    this.router.navigate(['/register-admin']);
    
  }

  handler () {
    
  }
  
  ngOnDestroy() {

}


}
