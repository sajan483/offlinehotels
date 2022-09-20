import { Injectable } from '@angular/core';
import { Day } from './models/day';

@Injectable({
  providedIn: 'root'
})
export class BiDatepickerService {

  constructor() { }
  private months: Map<String, Day[][]> = new Map();
  public getMonth(month: string): Day[][] {
    if (this.months.has(month)) {
      return this.months[month];
    }
    else {
      return null;
    }
  }
  public addMonth(key: string, month: Day[][]) {
    if (this.months.has(key)) {
      this.months.delete(key);
    }
    this.months.set(key, month);
  }

}
