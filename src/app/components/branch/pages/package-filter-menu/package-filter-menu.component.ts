import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, Renderer2, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-package-filter-menu',
  templateUrl: './package-filter-menu.component.html',
  styleUrls: ['./package-filter-menu.component.scss'],
  animations: [
    trigger('expand', [
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.5s', style({ height: 0, opacity: 0 }))
      ]),
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.5s', style({ height: '*', opacity: 1 }))
      ])
    ]),
  ],
})
export class PackageFilterMenuComponent implements OnInit {
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
  }

  nameFilter(evt) {
    this.filterGetData.packageName = this.packageName;
    this.emitData();
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
    this.emitData()
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
    this.emitData()
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
    this.emitData()
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
}


