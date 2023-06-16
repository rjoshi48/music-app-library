import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ReverifyComponent } from './reverify/reverify.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
 
  reVerify:boolean=false;
  userData: User = { user_id:'',username: '', email: '', role: '', isVerified:false,password:'' };
  constructor(public _auth: AuthService, private _router: Router, private _notification : NotificationService, private dialog: MatDialog) { }

  
  userNameFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4), 
  ]);

  form: FormGroup = new FormGroup({  
    email: this.userNameFormControl,
    password: this.passwordFormControl   
  });
  

  
  initializeFormGroup() {
    this.form.setValue({
      email: null,
      password: null
    });
  }

  ngOnInit() {
    this.initializeFormGroup();
  }

  ngOnDestroy(): void {
    this.initializeFormGroup();
    this.reVerify=false;
  }

  loginUser() {
    this.userData.email=this.form.value.email;
    this.userData.password=this.form.value.password;
    this._auth.loginUser(this.userData)
      .subscribe(
        res => {          
          localStorage.setItem('user_id', res.user.user_id);       
          localStorage.setItem('username', res.user.user_id);       
          localStorage.setItem('email', res.user.email);       
          localStorage.setItem('role', res.user.role);       
          localStorage.setItem('isVerified', res.user.isVerified);    
          localStorage.setItem('token', res.token);          
          this._router.navigate(['/home']);
        },
        err => {console.log('error', err.error)
        if(err.error){
          this._notification.warn(err.error.msg);
          if(err.error.msg=='Pending user verification'){
              this.reVerify=true;
              this.openDialog();
          }
        }
        }
      );

  }

  
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose=true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = this.userData;
    this.dialog.open(ReverifyComponent, dialogConfig);
  }

}
