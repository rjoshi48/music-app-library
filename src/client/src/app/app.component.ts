import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'music-library';

  constructor(public authService: AuthenticationService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
