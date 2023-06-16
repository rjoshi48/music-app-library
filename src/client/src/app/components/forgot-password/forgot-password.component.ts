import { RouterModule, Routes, ActivatedRoute, ParamMap,Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, Validators,NonNullableFormBuilder } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent{

  constructor(private authService: AuthenticationService, 
    private router1: RouterModule,private route:ActivatedRoute, private router:Router,
    private toast:HotToastService) { }

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
  }

  get email(){
    return this.forgotForm.get('email');
  };

  submit(){
    const {email} = this.forgotForm.value;

      if(!this.forgotForm.valid) return;

      this.authService.forgotPassword(email).pipe(
        this.toast.observe({
          success: 'Password reset link sent to registered email',
          loading: 'Signing in',
          error: ({ message }) => `${message}`
        })
      ).subscribe(() => {
        this.router.navigate(['/login']);
      })
  }

}
