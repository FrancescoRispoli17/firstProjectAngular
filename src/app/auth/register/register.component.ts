import { Component } from '@angular/core';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../../global.service';
import { RouterService } from '../../router.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };
  previousUrl: string | null = null;
  apiUrl = 'http://127.0.0.1:8000/api';
  
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private routeHistoryService: RouterService
  ) {}

  ngOnInit(): void {
    if(localStorage.getItem("access_token")){
      this.router.navigate(['/']);
    }
    this.previousUrl = this.routeHistoryService.getPreviousUrl();
    console.log("Rotta precedente:", this.previousUrl);
  }


  async register() {
    try {
      const response = await axios.post(`${this.apiUrl}/register`, this.form);
      
      localStorage.setItem('access_token', response.data.access_token);

      console.log('Registrazione avvenuta con successo!', response.data);
      const token = localStorage.getItem('access_token');
      try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      this.globalService.globalUser = response.data.user;
      console.log(this.globalService.globalUser)
    } catch (error) {
      console.error('Errore nel recupero dei dettagli utente', error);
    }
  
    if (this.previousUrl) {
      this.router.navigate([this.previousUrl]);
      localStorage.removeItem("previousUrl");
      this.previousUrl=null;
      console.log('Navigazione verso rotta precedente');
    } else {
      this.router.navigate(['/']);
      console.log('Navigazione verso home');
    }
    } catch (error) {
      console.error('Errore nella registrazione', error);
    }
  }
}
