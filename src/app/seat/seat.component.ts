import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';
import { AdvertiseComponent }from '../advertise/advertise.component';


@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [CommonModule,AdvertiseComponent],
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

  constructor(private route: ActivatedRoute,private globalService: GlobalService,private router: Router,) {}

  ngOnInit(): void {
    this.title =decodeURIComponent(this.route.snapshot.paramMap.get('title') || '');
    this.hour = this.route.snapshot.paramMap.get('hour');
    this.date = this.route.snapshot.paramMap.get('date');
    console.log(this.title, this.route.snapshot.paramMap.get('hour'), this.route.snapshot.paramMap.get('date'))
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
        if(reserved)
          this.reserved= reserved.split(",");
      })
      .catch((error) => {
        console.error('Errore durante il caricamento dei film:', error);
      });
  }
  async sendReservation(){
    if (!localStorage.getItem("access_token")) {
      this.router.navigate(['/login']);
      return 0;
    }else{
        const data = {
          reserve:this.reserve,
          title: this.title,
          date: this.date,
          time: this.hour,
          room:this.results.number,
          userID:this.globalService.globalUser.id
        };
        axios.post('http://127.0.0.1:8000/api/reservation', data)
          .then(response => {
            console.log('Risposta dal server:', response.data);
          })
          .catch(error => {
            console.error('Errore nella richiesta:', error);
          });

          const token = localStorage.getItem('access_token');
          try {
            const userResponse = await axios.get(`http://127.0.0.1:8000/api/user`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            localStorage.setItem('user', JSON.stringify(userResponse.data.user));
            this.globalService.globalUser = userResponse.data.user;
            console.log(userResponse.data.user);
            window.location.reload();
        } catch (error) {
            console.error('Errore nel recupero dei dettagli utente', error);
        }
          return 0;
      }
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
