import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BranchApiService } from 'src/app/Services/branch-api-service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  packageDetails: any = [];
  shimmer:boolean = false;
  currentPage:number = 1;
  totalPage:number;
  initializedPackages = false;
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
  types = [
    {
      name: 'Land Package',
      checked: false,
    },
    {
      name: 'Flight Package',
      checked: false,
    }
  ];
  selectedLocations = [];

  isTitleSorted = true;
  showMoreFilter = false;
  locations = [];
  packagePriceRange: number = 10000000;
  filter: string = '';
  searchText = '';
  sort = '&ordering=title';
  priceRange = '&max_price=10000000';
  formatLabel: any;
  currency: any;
  filterSetData: any;
  filterGetData: any;
  moreMenu:boolean = false;
  
  constructor(public packagesService:BranchApiService,private router: Router,private titleService: Title,private appStore:AppStore) {
    this.titleService.setTitle('Akbar Umrah:all-packages');
    this.currency = sessionStorage.getItem('userCurrency');
    if(!this.currency){
      this.currency = "SAR";
    }
    
    // this.appStore.currency.subscribe((e)=>{
    //   this.currency = e;
    // });
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.getPackages(this.currentPage)
  }

  getPackages(page){
    if(page==1){
      this.packageDetails = [];
    }
    this.shimmer = true;
    this.locations = [];
    this.packagesService.getB2bPackages(page,this.filter,this.sort).subscribe((data:any)=>{
      console.log(data);
      this.shimmer = false;
      this.initializedPackages = true;
      data.results.forEach(element => {
        this.packageDetails.push(element);
      });
      this.filterSetData = this.setFilterDatasFromList(this.packageDetails);
      this.filterGetData  = {
        priceRange:[],
        categories:[],
        types:[],
        locations:[]
      };
      this.totalPage = data.total_pages;
    })
  }

  packageView(item){
    this.router.navigate(['/branch/packages/'+item.id+'/details']);
    // this.router.navigate(["/packages/"+item.id+"/"+item.title.replaceAll(' ','-')+"-from-"+item.location+"-"+item.no_of_days+"-days"]);
    this.titleService.setTitle(item.no_of_days+" Days "+item.title + " from "+item.location);
  }

  paginateBookings(event) {
    if(event>=1 && event<=this.totalPage){
      this.currentPage = event;
      this.getPackages(this.currentPage,);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(e: Event): void{
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(this.currentPage < this.totalPage){
          this.currentPage = this.currentPage + 1;
          this.getPackages(this.currentPage);
        }
      }
  }


  applyFilter(event){
    this.filter = '';
    let selectedPriceRanges = event.priceRange.filter((e)=>e.checked)
    if(selectedPriceRanges.length>0){
      let minPrice = selectedPriceRanges[0].from;
      let maxPrice = selectedPriceRanges[0].to;
      selectedPriceRanges.forEach((e)=>{
        if(e.from<minPrice){
          minPrice = e.from;
        }
        if(e.to>maxPrice){
          maxPrice = e.to;
        }
      })
      this.priceRange = 'min_price='+minPrice+'&max_price='+maxPrice;
    }

    if(event.categories.findIndex(x=>x.checked)>-1){
      this.filter = this.filter + '&category=' ;
    }
    let i = event.categories.filter((e)=>e.checked).length;
    let k = 0;
    event.categories.forEach(element => {
      if(element.checked){
        k = k+1;
        this.filter +=  element.name.toLowerCase() + (i!=k?',':'');
      }
    });
    if(event.locations.length>0){
      let i = event.locations.length;
      let k = 0;
      this.filter = this.filter + '&location='
      event.locations.forEach(element => {
        k = k+1;
        this.filter = this.filter + element + (i!=k?',':'');
      });
    }
    if(event.packageName && event.packageName != ''){
      this.filter = this.filter + '&search=' + event.packageName;
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
    if(toggle=='title'){
      this.isTitleSorted = !this.isTitleSorted;
    }
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
  }

  setFilterDatasFromList(list:any[]){
    
    let price:number[] = [];
  
    list.forEach(data=>{
      price.push(Math.round(data.amount))
      if(!this.locations.includes(data.location) && data.location != '' && data.location != null){
        this.locations.push({name:data.location,checked:false})
      }
    
    });
    price = price.sort((a,b)=>a-b);
    let len:number = price.length/5;
    len = Math.floor(len);
    let priceRange:any[] = [
      {checked:false,from:0,to:price[len]},
      {checked:false,from:price[len],to:price[len*2]},
      {checked:false,from:price[len*2],to:price[len*3]},
      {checked:false,from:price[len*3],to:price[price.length-1]},
    ];
    let rd:any[] = [];
   
    priceRange.forEach((e)=>{
      if(rd.filter((e1)=>(e.from==e1.from && e.to==e1.to)).length==0){
        if(e.from != e.to){
            rd.push(e);
        }
      }
    }); 
    let setFilter = {
      priceRange:rd ,
      categories:this.categories,
      locations:this.locations,
      types:this.types
    }
    
    return setFilter;
  }


  showMoreMenu() {
    this.moreMenu = !this.moreMenu;
}   

}
