import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(): boolean {
    if (this._authService.loggedIn()) {
      this._router.navigate(['/home']);
    } else {
      return true;
    }
  }


}
