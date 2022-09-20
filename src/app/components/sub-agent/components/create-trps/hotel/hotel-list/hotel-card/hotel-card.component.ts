import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hotel-card',
  templateUrl: './hotel-card.component.html',
  styleUrls: ['./hotel-card.component.scss']
})
export class HotelCardComponent implements OnInit {
  is_readmore:boolean = true;
  @Input() hotelData:any;
  @Input() location:any;
  @Input() searchId:any;
  @Input() occupancy:any;
  @Input() currency:any;
  @Input() ulogId:any;
  @Output() addFavorited = new EventEmitter();
  isMobile: boolean = false;
  @Input() travellCount:number = 1;

  constructor(private route:Router,private activateRoute:ActivatedRoute) { }

  ngOnInit() {
    if (window.innerWidth < 992) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  moreBttnClick(evnt){
    let panel = evnt.target.previousElementSibling;
    if(panel.style.maxHeight){
      panel.style.maxHeight = null;
      this.is_readmore = true;
    }else{
      panel.style.maxHeight = panel.scrollHeight + "px";
      this.is_readmore = false;
    }
  }

  showDetails(data){
    this.activateRoute.params.subscribe(params =>{
      if(this.isMobile){
        this.route.navigate(["subagent/hotel-details/"+params.lang+"/"+params.currency],
        { queryParams: { 
                name:data.name,
                search:this.searchId,
                umrah_hotel_code:data.hotel_code,
                city:this.location,
                provider:data.providers[0].provider,
                vendor:data.providers[0].vendor,
                amoud:data.providers[0].amount,
                provider_htl_code:data.providers[0].hotel_code,
                special_code:"",
                subpcc_code:"",
                occupancy:this.occupancy,
                ulogId:this.ulogId
              }
          }
        )
      }else{
        const url = this.route.serializeUrl(
          this.route.createUrlTree(
            ["subagent/hotel-details/"+params.lang+"/"+params.currency],
            { queryParams: { 
              name:data.name,
              search:this.searchId,
              umrah_hotel_code:data.hotel_code,
              city:this.location,
              provider:"hudxconnect",
              vendor:"h",
              amoud:2450,
              provider_htl_code:"18361_en-US",
              special_code:"",
              subpcc_code:"",
              occupancy:this.occupancy,
              ulogId:this.ulogId
            } }
          )
        );
        window.open(url, '_blank');
      }
    })
  }

  addFavHotel(hotelCode:any){
    this.addFavorited.emit(hotelCode)
  }

}
