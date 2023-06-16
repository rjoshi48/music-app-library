import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../models/user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-reverify',
  templateUrl: './reverify.component.html',
  styleUrls: ['./reverify.component.scss']
})
export class ReverifyComponent implements OnInit {
  user: User;
  subscription: Subscription;
  constructor(private _auth: AuthService, @Inject(MAT_DIALOG_DATA) data: User, private dialogRef: MatDialogRef<ReverifyComponent>,private _notification : NotificationService) { this.user = data; }

  ngOnInit() {
  }

  ngOnDestroy() {
  //  this.subscription.unsubscribe();
  }
  onClick() {

    this._auth.resendVerification(this.user).subscribe(
      res => { console.log('res', res); this._notification.success('Verification mail sent!!')},
      err => { console.log('error', err.error);}
      );
    this.dialogRef.close();
  }

}
