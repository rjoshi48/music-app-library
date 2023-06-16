import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private _auth: AuthService) {
  }
  intercept(req, next) {
    if (this._auth.loggedIn()) {
      const tokenReq = req.clone({
        setHeaders: {
          Authorization: this._auth.getToken()
        }
      });
      return next.handle(tokenReq);
    } else {
      return next.handle(req);
    }
  }

}
