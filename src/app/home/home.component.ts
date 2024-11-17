import { Component } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdvertiseComponent }from '../advertise/advertise.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,AdvertiseComponent],
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
    axios.get('http://127.0.0.1:8000/api/programming')
      .then((response)=> {
        this.results=response.data.results;
        if(localStorage.getItem("films")){
          const storedFilm = JSON.parse(localStorage.getItem('films') || '{}');
          const storedDate = localStorage.getItem('date');

          this.selectedDay = this.results.find((movie: any) => 
            movie.date === storedFilm.date
          ) || this.results[0];
          this.selectedDate = storedDate || this.selectedDay.date;
          
        }else{
          this.selectedDay=response.data.results[0];
          this.selectedDate=response.data.results[0].date;
          console.log(this.selectedDay)
        }

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
    localStorage.setItem('films', JSON.stringify(film));
    localStorage.setItem('date', film.date);
  }
  currentIndex = 0;
  itemsToShow = 12; 

  scrollNext() {
    if (this.currentIndex < this.results.length - this.itemsToShow) {
      this.currentIndex++;
    }
  }

  scrollPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
