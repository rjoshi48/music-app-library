import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit,OnDestroy {

  userData: User = { username: '', email: '', isVerified:false,role:'',user_id:'' ,password:''};
  constructor(private _router: Router,private _auth: AuthService,private _notification:NotificationService) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  ngOnDestroy(): void {
    this.initializeFormGroup();
  }
    emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  
  userFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.pattern(/^[ \p{L}]+$/u) 
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4), 
  ]);

  form: FormGroup = new FormGroup({  
    email: this.emailFormControl,
    username : this.userFormControl,
    password: this.passwordFormControl   
  });
  

  
  initializeFormGroup() {
    this.form.setValue({
      email: null,
      username: null,
      password: null
    });
  }

  registerUser() {
    this.userData.email=this.form.value.email;
    this.userData.password=this.form.value.password;
    this.userData.username=this.form.value.username;
    this._auth.registerUser(this.userData)
      .subscribe(
        res => {console.log('hey', res);
        this._notification.success("User Registered. Please verify your email to continue");
        this._router.navigate(['/login']);
        

      
      },
        err => {console.log('error', err.error)
        if(err.error){
          this._notification.warn(err.error.msg);       
        }
        }
      );

  }

}
