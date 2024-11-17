import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  name: string | null = null;
  private userSubscription: Subscription | null = null;
  
  constructor(private router: Router,private globalService: GlobalService,) {}

  ngOnInit(): void {
    this.globalService.globalUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.userSubscription = this.globalService.globalUser$.subscribe(user => {
          this.name = user?.name;
          console.log(this.name);
          console.log(this.globalService.globalUser);
        });
  }


  logOut(){
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    this.globalService.globalUser = {};
    this.router.navigate(['/']);
  }
}
