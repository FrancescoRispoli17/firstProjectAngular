import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _user= new BehaviorSubject<any>({});
  private _title: string = "";

  constructor() {}

  globalUser$ = this._user.asObservable();

  get globalUser(): any {
    return this._user.value;
  }

  set globalUser(value: any) {
    this._user.next(value);
  }

  get globalTitle(): string {
    return this._title;
  }

  set globalTitle(value: string) { 
    this._title = value;
  }
}
