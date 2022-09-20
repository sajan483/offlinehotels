import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
// import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-package-filter-mob',
  templateUrl: './package-filter-mob.component.html',
  styleUrls: ['./package-filter-mob.component.scss'],
  animations: [
    trigger('filterAnimation', [
      state('state1', style({
        opacity: 0,
        height: 0,
        overflow: 'hidden',
        'pointer-events': 'none',
        top: '100vh'
      })),
      state('state2', style({
        opacity: 1,
        height: '*',
        top: 0,
        'pointer-events': 'all',
      })),
      transition('state1 => state2', animate('0.4s ease')),
      transition('state2 => state1', animate('0.3s ease-in'))
    ]),
    trigger('contentAnimation', [
      transition(':enter', [style(
        {
          transform: 'translateX(-100vw)',
          position: 'relative',
          'z-index': 50
        }),
      animate('0.3s')]),
      transition(':leave', [
        animate('0s', style({
          opacity: 0,
          position: 'relative',
          'z-index': 0
        }))])
    ])
  ]
})
export class PackageFilterMobComponent implements OnInit {
  @Output() closeFilter = new EventEmitter();
  public showPackageNameList: boolean[] = [] as boolean[];
  public showFilterPackageName: boolean = true;
  public showFilterPriceRange: boolean = true;
  public showFilterCategory: boolean = true;
  public showFilterTypes: boolean = true;

  showFilterLocations: boolean = true;
  public DisabledAnimation: boolean = true;
  @ViewChild('componentToAnimate', { static: true }) componentToAnimate;
  @ViewChild('filterWrapper', { static: true }) filterWrapper;
  @ViewChild('filterHeight', { static: true }) filterHeight;
  @ViewChild('skelton', { static: true }) skelton;
  public viewAllLoc: boolean = true; public showLessLoc: boolean = false;

  @Input() filterSetData: any;
  @Input() filterGetData: any;
  @Input() shimmer: boolean = true;
  packageName: any;
  @Input() currency: any;
  @Output() filterPostFun = new EventEmitter();
  @Output() resetFilterFun = new EventEmitter();
 
  constructor(private renderer: Renderer2) { }

  ngOnInit() { }

  resetFilter() {
    this.resetFilterFun.emit();
    this.closeFilterPopup();
  }

  nameFilter(evt) {
    this.filterGetData.packageName = this.packageName;
   
  }

  priceRange(evt, i) {
    let val = {
      from: this.filterSetData.priceRange[i].from,
      to: this.filterSetData.priceRange[i].to,
    }
    if (evt.checked) {
      this.filterSetData.priceRange[i].checked = true;
      this.filterGetData.priceRange.push(val)
    } else {
      this.filterSetData.priceRange[i].checked = false;
      let index = this.filterGetData.priceRange.findIndex(x => x.from === this.filterSetData.priceRange[i].from && x.to === this.filterSetData.priceRange[i].to)
      if (index != -1) {
        this.filterGetData.priceRange.splice(index, 1);
      }
    }
    
  }

  filterCategories(evt, i, data) {
    if (evt.checked) {
      this.filterSetData.categories[i].checked = true;
      this.filterGetData.categories.push(data)
    } else {
      this.filterSetData.categories[i].checked = true;
      let index = this.filterGetData.categories.indexOf(data);
      this.filterGetData.categories.splice(index, 1);
    }
  }

  filterLocations(evt, i, data) {
    if (evt.checked) {
      this.filterSetData.locations[i].checked = true;
      this.filterGetData.locations.push(data)
    } else {
      this.filterSetData.locations[i].checked = true;
      let index = this.filterGetData.locations.indexOf(data);
      this.filterGetData.locations.splice(index, 1);
    }
    this.emitData()
  }

  emitData() {
    this.filterPostFun.emit(this.filterGetData)
  }

  toggleFilterSections(section: string) {
    try {
      this.DisabledAnimation = false;
      if (section == 'packageName')
        this.showFilterPackageName = !this.showFilterPackageName;
      else if (section == 'priceRange')
        this.showFilterPriceRange = !this.showFilterPriceRange;
      else if (section == 'category')
        this.showFilterCategory = !this.showFilterCategory;
      else if (section == 'locations')
        this.showFilterLocations = !this.showFilterLocations;
      else if (section == 'types')
        this.showFilterTypes = !this.showFilterTypes;
      this.scrollFilterToTop();
    }
    catch (exception) {

    }
  }
  setVieworShow(type: string) {
    try {
      this.DisabledAnimation = false;
      if (type == "locations") {
        this.viewAllLoc = !this.viewAllLoc;
        this.showLessLoc = !this.showLessLoc;
      }
      this.scrollFilterToTop();
    }
    catch (exception) {

    }
  }
  scrollFilterToTop() {
    setTimeout(() => {
      if ((this.componentToAnimate.nativeElement.offsetHeight + window.pageYOffset) > document.documentElement.scrollHeight) {
        if (this.filterWrapper.nativeElement.scrollTop > this.componentToAnimate.nativeElement.offsetHeight / 3) {
          this.renderer.addClass(this.filterWrapper.nativeElement, 'smooth-scroll');
          this.filterWrapper.nativeElement.scrollTop = 100000000;
          this.renderer.removeClass(this.filterWrapper.nativeElement, 'smooth-scroll');
        }
      }
    }, 700);
  }



  filterTypes(evt, i, data) {
    if (evt.checked) {
      this.filterSetData.types[i].checked = true;
      this.filterGetData.types.push(data)
    } else {
      this.filterSetData.types[i].checked = true;
      let index = this.filterGetData.categories.indexOf(data);
      this.filterGetData.types.splice(index, 1);
    }
  }

  applayFilter() {
    this.closeFilter.emit(true);
    this.emitData();
  }
  
  closeFilterPopup(){
    this.closeFilter.emit(true);
  }

}

