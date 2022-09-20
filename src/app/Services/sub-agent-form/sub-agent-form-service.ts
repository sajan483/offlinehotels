import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class SubAgentFormService {
    private groupLeaderFormGrp: FormGroup;
  
    constructor() { }

    public set groupLeaderForm(value: FormGroup) {
      this.groupLeaderFormGrp = value
    }
  
    public get groupLeaderForm(): FormGroup {
      return this.groupLeaderFormGrp;
    }
    
}