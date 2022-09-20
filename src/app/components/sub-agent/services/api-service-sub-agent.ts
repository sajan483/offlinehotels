import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable()

export class ApiServiceSubAgent {

    constructor( private http: HttpClient ) {}

    getCurrencies() {
        return this.http.get( "currency/")
    }

    getStaffDetails(): Observable<any> {
        return this.http.get( "staff/profile/")
    }

    postSelectedHotelInfoV3(data, lang,id): Observable<any> {
        return this.http
          .post( "Offline/details1/?lang=" + lang +"&ulogId="+id, data)
    }

    getSelectedHotelInfoV3(id,taskId,cache_key): Observable<any> {
        return this.http
          .get( "Offline/details1/?task_id="+taskId+"&cache_key="+cache_key+"&ulogId="+id)
    }

    v2_5PilotHotelSearch(data: any, lang: any,id:any): Observable<any> {
        return this.http.post( "Offline/search/?lang=" + lang+"&ulogId="+id, data)
    }

    v2_5GetHotelList(id: any, lang: any,uId:any): Observable<any> {
        return this.http.get("Offline/?search_id=" + id  + "&lang=" + lang+"&ulogId="+uId)
    }

    makeFavorite(data: any): Observable<any> {
        return this.http.post( "favorite/", data)
    }

    getRoutes(lang): Observable<any> {
        return this.http.get("ground_transports/routes/?lang=" + lang)
    }

    getVehicles(lang): Observable<any> {
        return this.http.get("ground_transports/vehicle_types/?lang=" + lang)
    }

    searchTransport(data,lang,uId): Observable<any> {
        return this.http
          .post( "ground_transports/search/?lang=" + lang +"&ulogId="+uId, data)
    }

    searchTransportList(id,lang,uId): Observable<any> {
        return this.http
          .get("ground_transports/?search_id=" + id + "&lang=" + lang+"&ulogId="+uId)
    }

    createCustomTrip(data: any,lang,uId): Observable<any> {
        return this.http.post( "offline_hotels/custom_trips/?lang=" + lang+"&ulogId="+uId, data)
    }

    getCurrentSalesReport(data:any): Observable<any>{
        return this.http.post("staff/sales/",data)
    }

    getShareLinks(): Observable<any>{
        return this.http.get("staff/link_notification/")
    }

    makeDownloadLinkTrue(data): Observable<any>{
        return this.http.post("custom_trips/share_booked_trip/",data)
    }

    getSharedHistory(): Observable<any>{
        return this.http.get("staff/link_shared_history/")
    }

    getPaginatedhistoryList(pageNumber: number,lang,searchData:any): Observable<any> {
        return this.http.get( 'bookings/?page=' + pageNumber + "&lang=" + lang+searchData)
    }

    invoiceDownload(id,vatNumber,lng){
        return this.http.get("bookings/"+id+"/invoice_template/?vat_number="+vatNumber+"&lang="+lng)
    }

    getVoucherPdf(id,lang): Observable<any>{
        return this.http
        .get("bookings/"+id+"/voucher/?lang=" + lang,{responseType:'blob'})
    }

    getCheckCancellation(id,lang): Observable<any>{
        return this.http
        .get("b2b_trip_booking/"+id+"/check_cancellation/?lang=" + lang)
    }

    getStaffList(){
        return this.http.get( "staff/")
    }
    
    postStaffList(data:any){
        return this.http.post( "staff/", data)
    }

    getForBooking(){
        return this.http.get( "booking_for/")
    }

    postForBooking(data:any){
        return this.http.post( "booking_for/", data)
    }
}