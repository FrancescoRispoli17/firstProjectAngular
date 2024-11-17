import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { GlobalService } from '../../global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
  
})
export class ProfileComponent {
  user: any = {};

  ngOnInit(): void {
    if(!localStorage.getItem("access_token")){
      this.router.navigate(['/']);
    }else
      {
        this.user=this.globalService.globalUser;
      }
  }

  constructor(private router: Router,private globalService: GlobalService) {}

}
