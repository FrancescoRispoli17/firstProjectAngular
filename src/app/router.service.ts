import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  private previousUrl: string | null = null;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.previousUrl) {
          localStorage.setItem('previousUrl', this.previousUrl);
        }
        this.previousUrl = event.url;
      }
    });
  }

  getPreviousUrl(): string | null {
    return localStorage.getItem('previousUrl');
  }
}
