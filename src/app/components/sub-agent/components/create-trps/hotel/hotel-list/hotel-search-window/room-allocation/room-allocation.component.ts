import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Room } from 'src/app/models/visaTypes';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-room-allocation',
  templateUrl: './room-allocation.component.html',
  styleUrls: ['./room-allocation.component.scss']
})
export class RoomAllocationComponent implements OnInit {
  childPerRoomCount : number = environment.childPerRoom;
  adultPerRoomCount : number = environment.adultPerRoomCount;
  roomTypeForm: FormGroup;
  roomAges:any[]=[];
  @ViewChild("travellerIconClass", { read: ElementRef, static: false })
  travellerIconClass: ElementRef;
  @ViewChild("travellerPopupClass", { read: ElementRef, static: false })
  travellerPopupClass: ElementRef;
  @ViewChild("travellerPbuttonClass", { read: ElementRef, static: false })
  travellerPbuttonClass: ElementRef;
  displayRoomAllocation: boolean;
  selectCountAdult: number = 4;
  selectCountChild: number = 0;
  userRooms: Room[] = [];
  roomCount: number = 1;
  submitted = true;
  userObject: {};
  selectCountInfant: number = 0;
  paxArray: {};
  roomType: any[]=[];
  @Output() setRoomAlloction = new EventEmitter();
  occupancy:string='';
  @Input() getOccupancy:string = '#1_4_0';
  popupShow:boolean=false;
  @Input() isMobile: boolean = false;

  constructor(private renderer2: Renderer2,private fb:FormBuilder,private transilate:TranslateService) { 
    this.renderer2.listen("window", "click", (e: Event) => {
      let data = this.renderer2.parentNode(e.target);
      let isButton =false;
      if(data!=null && data !=undefined){
        if(data.classList!=undefined && data.classList!=null){
         isButton = data.classList.contains('removeID');
        }
      }
      if (
         (this.travellerPopupClass &&
           this.travellerPopupClass.nativeElement.contains(e.target)) ||
         (this.travellerIconClass &&
           this.travellerIconClass.nativeElement.contains(e.target)) || isButton
       ) {
         // Clicked inside plus preventing click on icon
       } else {
         // Clicked outside
         if(this.displayRoomAllocation){
           this.submitFormArray()
         }
       }
     });
  }

  ngOnInit() {
    this.setRoomType();
    this.setInitialForm();
  }

  showRoomAllocation(){
    if(this.isMobile){
      this.popupShow = true;
    }else{
      this.displayRoomAllocation = true;
    }
  }

  setRoomType(){
    this.roomTypeForm = this.fb.group({
      roomType: this.fb.array([]) ,
    });
  }

  newRoomType(): FormGroup {
    return this.fb.group({
      noOfRoom: [1,Validators.required],
      adultPerRoom: [2,Validators.required],
      ChildPerRoom: ['0',Validators.required],
      roomChild: this.fb.array([])
    })
  }

  roomTypesGet() : FormArray {
    return this.roomTypeForm.get("roomType") as FormArray
  }

  addRopomType() {
    this.roomTypesGet().push(this.newRoomType());
  }

  removeRopomType(i:number) {
    this.roomTypesGet().removeAt(i);
  }

  addRoomChild(i){
    const control = (<FormArray>this.roomTypeForm.controls['roomType']).at(i).get('roomChild') as FormArray;
    control.push(this.addRoomChildForm())
  }

  addRoomChildForm(){
    return this.fb.group({
      roomAge:this.fb.array([])
    })
  }

  addRoomChildAge(i,j){
    const control = ((<FormArray>this.roomTypeForm.controls['roomType']).at(i).get('roomChild') as FormArray).at(j).get('roomAge') as FormArray;
    control.push(this.addRoomChildAgeForm())
  }

  addRoomChildAgeForm(){
    return this.fb.group({
      roomAgeChild:['',Validators.required]
    })
  }

  addRoomChildAgeValue(i,j,value){
    const control = ((<FormArray>this.roomTypeForm.controls['roomType']).at(i).get('roomChild') as FormArray).at(j).get('roomAge') as FormArray;
    control.push(this.addRoomChildAgeFormValue(value))
  }

  addRoomChildAgeFormValue(value){
    return this.fb.group({
      roomAgeChild:[value,Validators.required]
    })
  }

  getValidity(i,j,k){
    return (((<FormArray>this.roomTypeForm.controls['roomType']).at(i).get('roomChild') as FormArray).at(j).get('roomAge') as FormArray).at(k).invalid;
  }

  addChild(i){
    this.submitted = false;    
    ((<FormArray>this.roomTypeForm.controls['roomType']).at(i).get('roomChild')as FormArray).clear()
    var data = this.roomTypeForm.value;
    for(var j=0;j < +(data.roomType[i].noOfRoom);j++){
      this.addRoomChild(i);
      for(var k=0;k<+(data.roomType[i].ChildPerRoom);k++){
        this.addRoomChildAge(i,j)
      }
    }
  }

  setInitialForm(){
    let rooms = this.getOccupancy.split('#');
    rooms.splice(0,1);
    rooms.forEach((value,i) =>{
      let subValue = value.split('C');
      let roomData = subValue[0].split('_');
      let roomValue:FormGroup = this.fb.group({
        noOfRoom: [roomData[0],Validators.required],
        adultPerRoom: [roomData[1],Validators.required],
        ChildPerRoom: [roomData[2],Validators.required],
        roomChild: this.fb.array([])
      })
      this.roomTypesGet().push(roomValue);
      if(subValue.length > 1){
        let child = subValue;
        child.splice(0,1);
        child.forEach((x,j) =>{
          this.addRoomChild(i)
          let ages = x.split('_');
          let age = ages;
          age.splice(0,1)
          let roomAge = this.fb.array([])
          age.forEach((y,k) =>{
            this.addRoomChildAgeValue(i,j,y)
          });
        })
      }
      
    })

    this.submitFormArray();
  }

  setOccupancy(value){
    this.occupancy = '';
    value.roomType.forEach(element =>{
      this.occupancy = this.occupancy+'#'+element.noOfRoom+'_'+element.adultPerRoom+'_'+element.ChildPerRoom;
      if(+element.ChildPerRoom > 0){
        element.roomChild.forEach(room =>{
          this.occupancy = this.occupancy+'C';
          room.roomAge.forEach(age =>{
            this.occupancy = this.occupancy + '_' +age.roomAgeChild
          })
        })
      }
    })
    
  }

  submitFormArray(){
    this.submitted = true;
    if(this.roomTypeForm.invalid){return}
    this.setOccupancy(this.roomTypeForm.value)
    this.selectCountAdult = 0;
    this.selectCountChild = 0;
    this.roomCount = 0;
    this.userRooms = [];
    let index = 0;
    var data = this.roomTypeForm.value;
    data.roomType.forEach(element =>{
      this.roomCount = this.roomCount + (+element.noOfRoom);
      for(let i=0;i<element.noOfRoom;i++){
        var ageArray = [];
        if(+element.ChildPerRoom > 0){
          element.roomChild[i].roomAge.forEach(age =>{
            ageArray.push(age.roomAgeChild)
          })
        }
        this.selectCountAdult = this.selectCountAdult + (+element.adultPerRoom);
        this.selectCountChild = this.selectCountChild + (+element.ChildPerRoom);
        let tempRoom: Room = {
          id: index,
          children: +element.ChildPerRoom,
          child_ages: ageArray,
          pax_info_str:null,
          seq_no: index.toString(),
          adults:+element.adultPerRoom
        };
        index = index + 1;
        this.userRooms.push(tempRoom);
      }
    })
    let x = [];var typObj={room_type:"",quantity:""};
    data.roomType.forEach(element => {
      typObj = {room_type:"",quantity:""}
      typObj.room_type = element.adultPerRoom;
      typObj.quantity = element.noOfRoom;
      x.push(typObj);
    });
    let y = [...x.reduce( (mp, o) => {
      if (!mp.has(o.room_type)) mp.set(o.room_type, { ...o, quantity: o.quantity });
      else mp.get(o.room_type).quantity += o.quantity;
      return mp;
    }, new Map).values()];
    this.setUserObject(y)
    this.displayRoomAllocation = false;
    this.popupShow = false;
  }

  setUserObject(y){
      this.paxArray = {
        travallersCount: this.selectCountAdult+"_"+this.selectCountChild+"_"+this.selectCountInfant,
        adults: this.selectCountAdult,
        children: this.selectCountChild,
        infant: this.selectCountInfant,
        rooms: this.userRooms,
        roomType: y,
        occupancy:this.occupancy,
        roomCount:this.roomCount
      };
    this.setRoomAlloction.emit(this.paxArray)
  }

  closeRoomPopup(){
    this.popupShow = false;
  }

}
