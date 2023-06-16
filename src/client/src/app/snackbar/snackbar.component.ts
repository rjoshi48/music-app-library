import { Component,Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material'; 

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SnackbarComponent implements OnInit {

  constructor (public snackBarRef: MatSnackBarRef<SnackbarComponent>,
  @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
