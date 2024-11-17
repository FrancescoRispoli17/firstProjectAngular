import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../../global.service';
import { RouterService } from '../../router.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form = {
    email: '',
    password: '',
  };
  previousUrl: string | null = null;
  apiUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private routeHistoryService: RouterService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("access_token")) {
      this.router.navigate(['/']);
    }
    this.previousUrl = this.routeHistoryService.getPreviousUrl();
    console.log("Rotta precedente:", this.previousUrl);
  }

  async login() {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, this.form);
      localStorage.setItem('access_token', response.data.access_token);

      console.log('Login avvenuto con successo!', response.data);

      const token = localStorage.getItem('access_token');
      try {
        const userResponse = await axios.get(`${this.apiUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        localStorage.setItem('user', JSON.stringify(userResponse.data.user));
        this.globalService.globalUser = userResponse.data.user;
        console.log(userResponse.data.user);
    } catch (error) {
        console.error('Errore nel recupero dei dettagli utente', error);
    }

      if (this.previousUrl && this.previousUrl != '/login' && this.previousUrl != '/register') {
        this.router.navigate([this.previousUrl]);
        localStorage.removeItem("previousUrl");
        this.previousUrl=null;
        console.log('Navigazione verso rotta precedente');
      } else {
        this.router.navigate(['/']);
        console.log('Navigazione verso home');
      }
    } catch (error) {
      console.error('Errore nel Login', error);
    }
  }
}
