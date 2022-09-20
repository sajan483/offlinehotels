export interface HotelListFilter {
    starRating:number[],
    price:number,
    aminities:any[],
    mealPlan:any[],
    hotelChainName:any[]
}

export interface PostFilterData {
    starFilter:any[],
    priceRange:number,
    aminitiesList:any[],
    mealPlanList:any[],
    hotelChainName:any[]
}