import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { SubAgentGeneralHelper } from 'src/app/helpers/sub-agent/general-helper';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-select-room-group',
  templateUrl: './select-room-group.component.html',
  styleUrls: ['./select-room-group.component.scss']
})
export class SelectRoomGroupComponent implements OnInit {
  @Input() rooms:any;
  @Input() selectedRoomGroups: any;
  @Input() totalRoomPrice: any;
  @Output()
  showRoomDetails = new EventEmitter();
  @Output()
  onTotalRoomPriceChanged = new EventEmitter();
  @Output()
  onRoomGroupChanged = new EventEmitter();
  baseUrl: string = "";
  prodUrl: string = environment.prodUrl;
  @Input()
  isGrouped = false;
  @Input()
  showGrpOptionButton: boolean;
  @Output()
  onRoomExpansionChanged = new EventEmitter();
  @Output()
  onHotelNameAdded = new EventEmitter();
  @Output()
  onHotelNameClear = new EventEmitter();
  @Output()
  onSelectedRoomCountChange = new EventEmitter();
  @Output()
  onDisableMakkaSave = new EventEmitter();
  @Output()
  onMakkaSelectActivate = new EventEmitter();
  @Output()
  onMakkaSelectDeactivate = new EventEmitter();

  @ViewChild('blinkButton', { read: ElementRef, static: false }) blinkButton: ElementRef;

  private subagentHelper: SubAgentGeneralHelper = new SubAgentGeneralHelper(null);
  currency: any;

  constructor() { }

  ngOnInit() {
    this.findProdUrlConfig()
  }


  ngDoCheck() {
    this.currency = HedderComponent.globelCurrency;
  }


  roomCount(i) {
    let totalRoom = 0;
    if (i != 0) {
      for (let j = (i - 1); j >= 0; j--) {
        totalRoom += this.selectedRoomGroups[j].length;
      }
    }
    return totalRoom;
  }

  currencyConversion(amount) {
    return this.subagentHelper.currencyCalculation(amount)
  }

  showRoomDetailsPopUp(room) {
    this.showRoomDetails.emit(room);
  }

  changeRoomGrpFalse(i, j, k) {
    let p = this.selectedRoomGroups[i];
    if (p.length > 0) {
      p[j].rooms.forEach(y => y.isExpand = false);
      for (let k = 0; k < p[j].rooms.length; k++) {
        if (p[j].rooms[k].isRoomSelectionChecked) {
          p[j].rooms[k].isRoomSelectionChecked =
            !p[j].rooms[k].isRoomSelectionChecked;
          let pr = p[j].rooms[k].selected_board_type.total_amount * p[j].rooms[k].quantity;
          if (this.totalRoomPrice > 0 && this.totalRoomPrice >= pr) {
            this.totalRoomPrice = this.totalRoomPrice - pr;
            this.onTotalRoomPriceChanged.emit(this.totalRoomPrice);
          }
        }
      }
    }

    if (!p[j].rooms[k].isRoomSelectionChecked) {
      this.onHotelNameAdded.emit(p[j].rooms[k].name);
      // this.hotlName.push(p[j].rooms[k].name)
      p[j].rooms[k].isRoomSelectionChecked = !p[j].rooms[k].isRoomSelectionChecked;
      p[j].rooms[k].isExpand = true;
      this.totalRoomPrice = this.totalRoomPrice + (p[j].rooms[k].selected_board_type.total_amount * p[j].rooms[k].quantity);
    }
    p[j].rooms.forEach(x => x.isDisplay = false)
    this.selectedRoomGroups[i] = p
    // this.onRoomGroupChanged.emit(this.selectedRoomGroups);
    // this.getRoomCount()
    if(this.baseUrl  == this.prodUrl){
      window.analytics.track('grouped false hotel selected',{
        portal:"B2B"
      });
    }
    this.calculateTotal();
  }

  changeRoomExpansionState(i, j) {
    this.onHotelNameClear.emit();
    // this.hotlName = [];
    let p = this.selectedRoomGroups[i];
    if (p.length > 0) {
      for (let k = 0; k < p[j].rooms.length; k++) {
        if (p[j].rooms[k].isRoomSelectionChecked) {
          p[j].rooms[k].isRoomSelectionChecked =
            !p[j].rooms[k].isRoomSelectionChecked;
          if (this.totalRoomPrice > 0) {
            this.totalRoomPrice = this.totalRoomPrice - (p[j].rooms[k].display_fare_summary.total_amount * p[j].rooms[k].quantity);
          }
        }
      }
    }
    p[j].rooms.forEach(x => x.isExpand = false);
    p[j].rooms.forEach(x => x.isDisplay = true)
    // this.getRoomCount();
    this.calculateTotal();
  }

  calculateTotal() {
    let total = 0;
    this.selectedRoomGroups.forEach(roomGroup => {
      roomGroup.forEach(room => {
        room.rooms.forEach(r => {
          if (r.isRoomSelectionChecked) {
            total = total + r.selected_board_type.display_fare_summary.total_amount;
          }
        });
      });
    });

    this.onTotalRoomPriceChanged.emit(total);
  }

  mealOptionRadioBtnChanged(evnt, i,j,k) {
    if (this.blinkButton != undefined) {
      this.blinkButton.nativeElement.classList.add('blink_me')
    }
    setTimeout(() => {
      if (this.blinkButton != undefined) {
        this.blinkButton.nativeElement.classList.remove('blink_me')
      }
    }, 2000);

    for(var p=0;p<this.selectedRoomGroups[i].length;p++){
      for(var q=0;q<this.selectedRoomGroups[i][p].rooms.length;q++){
        this.selectedRoomGroups[i][p].rooms[q].board_types.forEach((room)=>{
          if(room.meal_title == evnt.value){
            room.showMeal = true;
            this.selectedRoomGroups[i][p].rooms[q].selected_board_type = room;
          }else{
            room.showMeal = false;
          }
        })
      }
    }

    this.calculateTotal();
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('hotel-details/meal plan selected', {
        selectedMealPlan: evnt,
        portal: "B2B"
      });
    }
  }

  findProdUrlConfig() {
    const parsedUrl = new URL(window.location.href);
    this.baseUrl = parsedUrl.origin;
  }

  showAllShrinkedOPtions() {
    this.selectedRoomGroups.forEach(x => x.isDisplayGroup = true);
    this.showGrpOptionButton = false;
  }

  changeRoomExpansionStateForGroupedTrue(i) {
    this.onHotelNameClear.emit();
    // this.hotlName = []
    this.onSelectedRoomCountChange.emit(0);
    // this.selectedRoomCount = 0;
    this.totalRoomPrice = 0;
    for (let k = 0; k < this.selectedRoomGroups.length; k++) {
      this.selectedRoomGroups[i].isRoomSelectionChecked = false;
      this.selectedRoomGroups[i].isExpand = true;
    }
    this.onDisableMakkaSave.emit();
    // this.diasbleMakkaSave = true;
    this.showAllShrinkedOPtions()
    this.onMakkaSelectActivate.emit()
    // this.makkaSelectActivate = true;

  }

  makkaIsGroupedRadioClicked(i, j) {
    // this.selectedRoomCount = 0;
    this.onSelectedRoomCountChange.emit(0);

    this.totalRoomPrice = 0;
    for (let k = 0; k < this.selectedRoomGroups.length; k++) {
      this.selectedRoomGroups[k].isRoomSelectionChecked = false;
      this.selectedRoomGroups[k].isExpand = true;
    }
    this.totalRoomPrice = this.selectedRoomGroups[i].display_fare_summray.total_amount;
    this.selectedRoomGroups[i].rooms.forEach(x => this.onHotelNameAdded.emit(x.name))
    this.selectedRoomGroups[i].isRoomSelectionChecked = true;
    this.selectedRoomGroups[i].isExpand = false;
    this.onSelectedRoomCountChange.emit(this.rooms.length);

    // this.selectedRoomCount = this.rooms.length;
    this.selectedRoomGroups.forEach(x => x.isDisplayGroup = false);
    this.showGrpOptionButton = true
    // this.makkaSelectActivate = false;
    this.onMakkaSelectDeactivate.emit();
    this.onRoomGroupChanged.emit(this.selectedRoomGroups);
    if (this.baseUrl == this.prodUrl) {
      window.analytics.track('grouped hotel selected', {
        poral: "B2B"
      });
    }

  }
}
