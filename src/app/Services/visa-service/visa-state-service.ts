import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class VisaStateService {
    private visaItinerayFGrp: FormGroup;
  
    constructor() { }
    // set visa Itinary FormGroup 
    public set visaItinerayForm(value: FormGroup) {
      this.visaItinerayFGrp = value
    }
  
    // get Visa itneray form 
    public get visaItinerayForm(): FormGroup {
      return this.visaItinerayFGrp;
    }
    
}