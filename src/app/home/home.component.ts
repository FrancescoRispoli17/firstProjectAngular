import { Component } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  results:any[]=[];
  selectedDay:any;
  selectedDate: any;
  
  ngOnInit(): void {
    this.getFilms();
  }
  
  getFilms(){
    axios.get('http://127.0.0.1:8000/api/movie')
      .then((response)=> {
        this.results=response.data.results;
        this.selectedDay=response.data.results[0];
        this.selectedDate=response.data.results[0].date;

        // const today = new Date().toISOString().split('T')[0];
        // const todayShow = response.data.results.find((movie: any) => movie.date === today);
        // this.selectedDay=todayShow.spettacoli;
      })
      .catch((error) => {
        console.error('Errore durante il caricamento dei film:', error);
      });
  }
  formatTime(hour: string): string {
    const [hours, minutes] = hour.split(':');
    return `${hours}:${minutes}`;
  }
  changefilm(film:any){
    this.selectedDay=film;
    this.selectedDate=film.date;
  }
}
