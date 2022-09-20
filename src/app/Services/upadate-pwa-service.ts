import { Injectable } from '@angular/core';
import { interval } from 'rxjs/internal/observable/interval';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class UpdatePwaService {

    constructor(public updates: SwUpdate) {
      if (updates.isEnabled) {
        interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
          .then(() => console.log('checking for updates')));
      }
    }
  
    public checkForUpdates(): void {
      this.updates.available.subscribe(event => this.promptUser());
    }
  
    private promptUser(): void {
      console.log('updating to new version');
      this.updates.activateUpdate().then(() => document.location.reload()); 
    }
}