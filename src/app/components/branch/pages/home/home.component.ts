import { Component, OnInit,ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BranchApiService } from 'src/app/Services/branch-api-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  service : any = 'All Months';
  showSelectionPopUp: boolean;
  countAdult: number = 1;
  countChild: number = 0;
  countInfant: number = 0;
  displayTabtravel: boolean;
  @ViewChild("serviceDropDown", { read: ElementRef, static: false })
  serviceDropDown: ElementRef;
  @ViewChild("selectionPopUp", { read: ElementRef, static: false })
  selectionPopUp: ElementRef;
  packages: any[]=[];
  tempPackages:any[]=[];
  shimmer: boolean =true;
  depatureAirports:any;
  numberOfDays:any;
  totalPage:number;
  currentPage:number = 1;

  categories = [
    {
      name: 'Normal',
      checked: false,
    },
    {
      name: 'VIP',
      checked: false,
    },
    {
      name: 'Premium',
      checked: false,
    },

  ];
  selectedLocations = [];

  isTitleSorted = false;
  // isPriceSorted = false;
  showMoreFilter = false;
  locations = [];
  packagePriceRange: number = 100000;
  searchText = '';
  filter = '';
  sort = '&ordering=title';
  priceRange = '&max_price=100000';
  formatLabel: any;

  @HostListener('window:scroll', ['$event'])
  onScroll(e: Event): void{
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(this.currentPage < this.totalPage){
          this.currentPage = this.currentPage + 1;
          this.getPackages(this.currentPage);
        }
      }
  }
  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  constructor(private renderer2: Renderer2,private branchApi:BranchApiService,private route:Router) {

    this.renderer2.listen("window", "click", (e: Event) => {
      if (
        (this.selectionPopUp &&
          this.selectionPopUp.nativeElement.contains(e.target)) ||
        (this.serviceDropDown &&
          this.serviceDropDown.nativeElement.contains(e.target))
      ) {
        // Clicked inside plus preventing click on icon
      } else {
        // Clicked outside
        this.showSelectionPopUp = false;
      }
    });
   }

  ngOnInit() {
    this.getPackages(this.currentPage)
  }

  getPackages(page){
    if(page==1){
      this.packages = [];
    }
    this.shimmer = true;
    this.branchApi.getB2bPackages(page,this.filter,this.sort).subscribe((data)=>{

      this.packages.push(...data.results);
      this.totalPage = data.total_pages;
      this.currentPage = data.page;

      this.locations =[];
      this.shimmer = false;
      this.packages.forEach((element)=>{
        if(!this.locations.includes(element.location) && element.location!=null && element.location!=''){
              this.locations.push(element.location)
            }
      })
      // this.packages.forEach(element =>{
      //   if(!airport.includes(element.boarding_airport)){
      //     airport.push(element.boarding_airport)
      //   }
      //   if(!days.includes(element.num_days)){
      //     days.push(element.num_days);
      //   }
      // })
      // this.depatureAirports = this.onlyUnique(airport)
      // this.numberOfDays = this.onlyUnique(days).sort((a, b)=> a-b)
    })
    this.tempPackages = this.packages
  }

  paginateEnquiries(event) {
    if(event>=1 && event<=this.totalPage){
      this.currentPage = event;
      this.getPackages(this.currentPage);
    }
  }

  onlyUnique(array) {
    return array.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    })
  }

  showSelectionPopup() {this.showSelectionPopUp = !this.showSelectionPopUp;}

  onServiceItemChange(value){
    this.packages = this.tempPackages;
    (value == 'all') ? this.tempPackages :this.packages = this.packages.filter(x=>x.start_date.split('-')[1] == value)
  }

  onNoOfDaysSelected(item){
   this.packages = this.tempPackages;this.packages = this.packages.filter(x => x.num_days == item)}

  onAirportSelected(item){
    this.packages = this.tempPackages;this.packages.filter(x => x.boarding_airport == item)}

  viewPackageDetails(id:number){this.route.navigate(['/branch/packages/'+id+'/details'])}



  moreFilter(){
    this.showMoreFilter = !this.showMoreFilter;
    if ((<HTMLElement>document.getElementById("showMoreFilter")).style.maxHeight) {
      (<HTMLElement>document.getElementById("showMoreFilter")).style.maxHeight = null;
    } else {
      (<HTMLElement>document.getElementById("showMoreFilter")).style.maxHeight = "416px";
    }

  }

  getCategories(){
    return this.categories;
  }
  addFilterModel(val,type,$event){
    console.log(val);
   if(type=='category'){
    this.categories.forEach(element => {
      if(element.name==val){
        element.checked = !element.checked;
      }
    });
   }
   if(type=='locations'){
     if(!this.selectedLocations.includes(val)){
       this.selectedLocations.push(val);
     }else{
      this.selectedLocations.splice(this.selectedLocations.indexOf(val),1);
     }
   }
  }

  onInputPriceRangeFilter(event) {
    console.log(event);
    this.priceRange = '&max_price='+event.value;
    this.packagePriceRange = event.value;
    this.applyFilter();
  }


  applyFilter(){
    this.filter = '';
    if(this.categories.findIndex(x=>x.checked)>-1){
      this.filter = this.filter + '&category=' ;
    }
    let i = this.categories.filter((e)=>e.checked).length;
    let k = 0;
    this.categories.forEach(element => {
      if(element.checked){
        k = k+1;
        this.filter +=  element.name.toLowerCase() + (i!=k?',':'');
      }
    });
    if(this.selectedLocations.length>0){
      let i = this.categories.filter((e)=>e.checked).length;
      let k = 0;
      this.filter = this.filter + '&location='
      this.selectedLocations.forEach(element => {
        i = i+1;
        this.filter = this.filter + element + (i!=this.selectedLocations.length?',':'');

      });
    }
    if(this.searchText != ''){
      this.filter = this.filter + '&search=' + this.searchText;
    }
    if(this.priceRange != ''){
      this.filter = this.filter + this.priceRange;
    }
    this.currentPage =1;
    this.getPackages(this.currentPage);
  }

  resetAllFilter(){
    this.currentPage = 1;
    this.searchText = '';
    this.filter = '';
    this.getPackages(this.currentPage);
  }

  onSortToggle(toggle){
    this.sort = '&ordering=';
    // if(toggle == 'price'){
    //   this.isPriceSorted = !this.isPriceSorted;
    // }
    if(toggle=='title'){
      this.isTitleSorted = !this.isTitleSorted;
    }
    // if(this.isPriceSorted){
    //   this.sort += 'packages__adult_price';
    // }else{
    //   this.sort += '-packages__adult_price';
    // }

    if(this.isTitleSorted){
      this.sort += 'title';
    }else{
      this.sort += '-title';
    }
    this.currentPage = 1;
    this.getPackages(this.currentPage);
  }

  closeFilterPoup() {
    this.filter = '';
    this.sort = '&ordering=title'
    this.currentPage =1;
    this.selectedLocations = [];
    this.categories.forEach((e)=>e.checked=false);
    this.getPackages(this.currentPage);
    this.moreFilter();
  }
}
