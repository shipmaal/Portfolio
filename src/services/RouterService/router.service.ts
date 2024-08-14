import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  currentRoute: string;

  constructor(private router: Router) {
    this.currentRoute = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.router.url;
      });
  }
}
