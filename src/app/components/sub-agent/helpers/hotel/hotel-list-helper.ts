import { HotelListFilter } from "../../models/hotelListModel";

export class SubAgentHotelListHelper {
    constructor(){}

    hotelListFilter(filterData:HotelListFilter,hotelList:any):any[]{
        let startFilter = [];
        let priceFilter = [];
        let amenitiesFilter = [];
        let mealFilter = [];
        let hotelChainFilter = [];
        
        if(filterData.starRating.length > 0){
            startFilter = hotelList.filter(e => filterData.starRating.includes(e.rating))
        }else{
            startFilter = hotelList;
        }
        if(filterData.price > 0){
            priceFilter = startFilter.filter(e => e.amount <= filterData.price)
        }else{
            priceFilter = startFilter;
        }
        if(filterData.aminities.length>0){
            amenitiesFilter = priceFilter.filter(e =>{
                return e.amenities.filter(d => filterData.aminities.includes(d.name)).length > 0
            })
        }else{
            amenitiesFilter = priceFilter;
        }
        if(filterData.mealPlan.length > 0){
            mealFilter = amenitiesFilter.filter(e => filterData.mealPlan.includes(e.meal_provided))
        }else{
            mealFilter = amenitiesFilter;
        }
        if(filterData.hotelChainName.length > 0){
            hotelChainFilter = mealFilter.filter(e => filterData.hotelChainName.includes(e.umrah_hotel_code))
        }else{
            hotelChainFilter = mealFilter;
        }
        return hotelChainFilter;
    }

    hotelListSort(evt:number,hotelsList:any){
        if(evt == 1){
            return this.sortByPrice(false,hotelsList);
        }
        if(evt == 2){
            return this.sortByPrice(true,hotelsList);
        }
          if(evt == 3 || evt == 4){
            return this.haramDistanceSort(evt,hotelsList);
          }
          if(evt == 5 || evt == 6){
            return this.nabawiDistanceSort(evt,hotelsList);
          }
          if(evt == 7){
            hotelsList.sort((a, b) => a.favorite === b.favorite ? 0 : (a.favorite ? -1 : 1));
            return hotelsList;
          }
    }

    haramDistanceSort(id,hotelsList){
        let nullList = hotelsList.filter(x => x.haram_distance == null)
        hotelsList = hotelsList.filter(x => x.haram_distance)
        if(id == 3){
          hotelsList.sort((a, b) => (a.haram_distance) - (b.haram_distance));
        }
        if(id == 4){
          hotelsList.sort((a, b) => (b.haram_distance) - (a.haram_distance));
        }
        hotelsList = hotelsList.concat(nullList);
        return hotelsList;
      }
    
      nabawiDistanceSort(id,hotelsList){
        let nullList = hotelsList.filter(x => x.nabawi_distance == null)
        hotelsList = hotelsList.filter(x => x.nabawi_distance)
        if(id == 5){
          hotelsList.sort((a, b) => (a.nabawi_distance) - (b.nabawi_distance));
        }
        if(id == 6){
          hotelsList.sort((a, b) => (b.nabawi_distance) - (a.nabawi_distance));
        }
        hotelsList = hotelsList.concat(nullList);
        return hotelsList;
      }
    
      sortByPrice(asc,hotelsList){
        for (let i = 0; i < hotelsList.length; i++)
        {
            let min_idx = i;
            for (let j = i + 1; j < hotelsList.length; j++){
                if(!asc){
                  if (hotelsList[j].amount < hotelsList[min_idx].amount){
                    min_idx = j;
                }
                }else{
                  if (hotelsList[j].amount > hotelsList[min_idx].amount){
                    min_idx = j;
                }
                }
              }
            let temp = hotelsList[min_idx];
            hotelsList[min_idx] = hotelsList[i];
            hotelsList[i] = temp;
        }
        return hotelsList;
      }
}