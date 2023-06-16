import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) { }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  }


  success(msg) {
    this.config.panelClass = ['notification', 'success'];
    this.config.data=msg;
    this.snackBar.openFromComponent(SnackbarComponent,this.config);
  }

  warn(msg) {
    this.config.panelClass = ['notification', 'warn'];
    this.config.data=msg;
    this.snackBar.openFromComponent(SnackbarComponent,this.config);
  }



  
  
}
