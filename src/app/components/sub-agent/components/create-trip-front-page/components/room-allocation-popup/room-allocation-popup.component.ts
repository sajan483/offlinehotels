import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/visaTypes';
import { NotificationService } from 'src/app/common/services/notification.service';
import { AppStore } from 'src/app/stores/app.store';
import { CreateTripComponent } from '../../../create-trip/create-trip.component';
import {TranslateService} from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl,FormArray, FormBuilder, Validators } from '@angular/forms'


@Component({
  selector: 'app-room-allocation-popup',
  templateUrl: './room-allocation-popup.component.html',
  styleUrls: ['./room-allocation-popup.component.scss']
})

export class RoomAllocationPopupComponent implements OnInit {
  childages: any[] = [];
  userRooms: Room[] = [];
  countAdult:number = 0;
  countChild: number = 0;
  countInfant: number = 0;
  showRoomAllocationPopup: boolean = false;
  adultPerRoomCount : number = environment.adultPerRoomCount;
  childPerRoomCount : number = environment.childPerRoom
  steps: [];
  rooms: Room[] = [];
  selecteddaysmakkah: number;
  @Input() dataFromPopUp:any;
  roomTypeForm: FormGroup;
  roomType:FormArray;
  selectCountAdult:number;
  selectCountChild:number;
  errorMsg: string;

  constructor(private appStore:AppStore,private fb:FormBuilder,
    private notifyService:NotificationService,
    private router:Router,private transilate:TranslateService) { }
  
  ngOnInit() {
    this.showRoomAllocationPopup = true;
    this.rooms = this.appStore.roomArray;
    this.setRoomType();
    this.setInitioalDatas()
  }

  /**
   * set room type array form
   */
  setRoomType(){
    this.roomTypeForm = this.fb.group({
      roomType: this.fb.array([this.newRoomType()]) ,
    });
  }

  roomTypesGet() : FormArray {
    return this.roomTypeForm.get("roomType") as FormArray
  }

  newRoomType(): FormGroup {
    return this.fb.group({
      noOfRoom: [1,Validators.required],
      adultPerRoom: ['1',Validators.required],
      ChildPerRoom: ['0',Validators.required],
    })
  }

  addRopomType() {
    this.roomTypesGet().push(this.newRoomType());
  }

  removeRopomType(i:number) {
    this.roomTypesGet().removeAt(i);
  }

  setInitioalDatas(){
    var obj = JSON.parse(sessionStorage.getItem('userObject'))
    this.countAdult = obj.adults;
    this.countChild = obj.children + obj.infant;
  }

  /**
   * This method for allocating rooms according to trveller count
   */
  setRoomAllocation() {
      var obj = JSON.parse(sessionStorage.getItem('userObject'))
      this.userRooms = [];
      let adultsPerRoom = this.adultPerRoomCount;
      this.countAdult = obj.adults;
      this.countChild = obj.children;
      this.countInfant = obj.infant
      var adult = this.countAdult;
      var child = this.countChild + this.countInfant;
      let nofrooms = Math.ceil(adult/ adultsPerRoom);
      let childrenperroom = this.childPerRoomCount;
      let extrachildrenroom = child % nofrooms;
      let index = 0;
      while (nofrooms > 0) {
        let tempRoom: Room = {
          id: index,
          children: 0,
          child_ages: [],
          pax_info_str:null,
          seq_no:"",
          adults:0
        };
        
        if (adult > 0) {
          if (adult < adultsPerRoom) {
            tempRoom.adults = adult;
          } else {
            tempRoom.adults = adultsPerRoom;
          }
          adult -= adultsPerRoom;
        }

        if (child > 0) {
          if (child < childrenperroom) {
            tempRoom.children = child;
          } else {
            tempRoom.children = childrenperroom;
          }
          child -= childrenperroom;
          if (extrachildrenroom > 0 && extrachildrenroom == nofrooms) {
            //tempRoom.children += 1;
            extrachildrenroom -= 1;
            child -= 1;
          }
        }

        index += 1;
        nofrooms -= 1;
        this.userRooms.push(tempRoom);
      }
  }

  setRoomDatas(){
    this.userRooms = [];
    this.selectCountAdult = 0;
    this.selectCountChild = 0;
    this.errorMsg = "";
    this.alocateRooms(this.roomTypeForm.value)
  }

  alocateRooms(roomtype){
    let index = 0;
    roomtype.roomType.forEach(element => {
      var ageArray = [];
      for(let j=0;j<+element.ChildPerRoom;j++){
        ageArray.push(10);
      }
      for(let i=1;i<=element.noOfRoom;i++){
        this.selectCountAdult = this.selectCountAdult + (+element.adultPerRoom);
        this.selectCountChild = this.selectCountChild + (+element.ChildPerRoom);
        let tempRoom: Room = {
          id: index,
          children: +element.ChildPerRoom,
          child_ages: ageArray,
          pax_info_str:null,
          seq_no:"",
          adults:+element.adultPerRoom
        };
        index = index + 1;
        this.userRooms.push(tempRoom);
      }
    });

    if(this.selectCountAdult > this.countAdult){
      this.errorMsg = "Pax Alocated "+this.selectCountAdult+" Out Of "+ this.countAdult +" , "+(this.selectCountAdult-this.countAdult)+" Adult is Exceeded ";
    }else 
    if(this.selectCountAdult < this.countAdult){
      this.errorMsg = "Pax Alocated "+this.selectCountAdult+" Out Of "+ this.countAdult +" , "+(this.countAdult-this.selectCountAdult)+" Adult is Pending ";
    }else if(this.countChild > 0){
      if(this.selectCountChild > this.countChild){
        this.errorMsg = "Child Alocated "+this.selectCountChild+" Out Of "+ this.countChild +" , "+(this.selectCountChild-this.countChild)+" Adult is Exceeded ";
      }else 
      if(this.selectCountChild < this.countAdult){
        this.errorMsg = "Child Alocated "+this.selectCountChild+" Out Of "+ this.countChild +" , "+(this.countChild-this.selectCountChild)+" Adult is Pending ";
      }else{
        sessionStorage.setItem("roomData",JSON.stringify(this.userRooms));
        this.router.navigate(['subagent/createTrip'], { queryParams: { steps: this.dataFromPopUp.steps.join(","),tripId:0} });
        this.appStore.showRoomAlPopup = false;
      }
    }else{
      sessionStorage.setItem("roomData",JSON.stringify(this.userRooms));
      this.router.navigate(['subagent/createTrip'], { queryParams: { steps: this.dataFromPopUp.steps.join(","),tripId:0} });
      this.appStore.showRoomAlPopup = false;
    }
    
  }
  
  hideRoomAllocationPopup(){
    this.showRoomAllocationPopup = false;
    this.appStore.showRoomAlPopup = false;
  }
}