import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home-dash',
  templateUrl: './home-dash.component.html',
  styleUrls: ['./home-dash.component.scss']
})
export class HomeDashComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'About', cols: 1, rows: 1 },
          { title: 'Songs', cols: 1, rows: 1 },
  
        ];
      }

      return [
        { title: 'About', cols: 2, rows: 1 },
        { title: 'Songs', cols: 2, rows: 3 },
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
