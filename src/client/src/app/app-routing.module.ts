import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LandingComponent } from './components/landing/landing.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    component: LandingComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'sign-up',
    component: SignUpComponent
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path:'verify-email',
    component: VerifyEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
