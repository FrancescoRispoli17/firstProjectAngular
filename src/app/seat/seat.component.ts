import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.scss'
})
export class SeatComponent {
  title: string | null = null;
  hour: string | null = null;
  date: string | null = null;
  results:any;
  reserve:any[]=[];
  reserved:any[]=[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title');
    this.hour = this.route.snapshot.paramMap.get('hour');
    this.date = this.route.snapshot.paramMap.get('date');
    this.getShow();
  }

  getShow(){
    axios.get('http://127.0.0.1:8000/api/show',{
      params:{
        title:this.title,
        time:this.hour,
        date:this.date
      }
    })
      .then((response)=> {
        this.results=response.data.results[0];
        let reserved = response.data.results[0].occupy;
        this.reserved= reserved.split(",");
      })
      .catch((error) => {
        console.error('Errore durante il caricamento dei film:', error);
      });
  }
  sendReservation(){
    const payload = {
      reserve:this.reserve,
      title: this.title,
      date: this.date,
      time: this.hour
    };
    axios.post('http://127.0.0.1:8000/api/reservation', payload)
      .then(response => {
        console.log('Risposta dal server:', response.data);
        window.location.reload();
      })
      .catch(error => {
        console.error('Errore nella richiesta:', error);
      });
  }

  createArray(length: string): any[] {
    return Array(length);
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  formatTime(hour: string): string {
    const [hours, minutes] = hour.split(':');
    return `${hours}:${minutes}`;
  }

  addToReserve(c: any, i: number): void {
    const value = `${c}${i + 1}`;
    const index = this.reserve.indexOf(value);
    if (index === -1) {
      this.reserve.push(value);
    } else {
      this.reserve.splice(index, 1);
    }
  }
}
