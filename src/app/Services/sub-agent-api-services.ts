import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { listAirport } from "../models/listAirport";


@Injectable()
export class SubAgentApiService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  getStaffDetails(id): Observable<any> {
    return this.http.get( "staff/profile/" +"?ulogId="+id)
  }

  getIbanList(): Observable<any> {
    return this.http.get( "iban/")
  }

  addIbanNumber(data): Observable<any> {
    return this.http
      .post( "iban/", data)
  }

  getSelectedHotelInfoV2_5(data, lang,id,taskId): Observable<any> {
    return this.http
      .post( "hotels/v2.5/details/?task_id="+taskId+"&lang=" + lang +"&ulogId="+id, data)
  }

  postSelectedHotelInfoV3(data, lang,id): Observable<any> {
    return this.http
      .post( "hotels/v3/details/?lang=" + lang +"&ulogId="+id, data)
  }

  getSelectedHotelInfoV3(id,taskId,cache_key): Observable<any> {
    return this.http
      .get( "hotels/v3/details/?task_id="+taskId+"&cache_key="+cache_key+"&ulogId="+id)
  }

  saveSelectedHotel(data,lang ,id): Observable<any> {
    return this.http
      .post( "custom_trips/"+"?lang=" + lang +"&ulogId="+id, data)
  }


  getVoucherPdf(id,lang): Observable<any>{
    return this.http
    .get("bookings/"+id+"/voucher/?lang=" + lang,{responseType:'blob'})
  }

  getRecieptPdf(id,vat,lang): Observable<any>{
    return this.http
    .get("bookings/"+id+"/receipt/?vat_number= "+vat+"&lang=" + lang,{responseType:'blob'})
  }

  getLanguages(): Observable<any> {
    return this.http
      .get( "languages/")
  }

  updateCustomTrip(id,data,lang,uId): Observable<any>{
    return this.http
    .put("custom_trips/"+id+"/?lang=" + lang + "&ulogId="+uId,data)
  }

  bookCustomTrip(data,uId): Observable<any> {
    return this.http
      .post( "custom_trips/"+"?ulogId="+uId, data)
  }

  getPaymentDetails(id,lang,uId): Observable<any>{
    return this.http
      .get("bookings/"+id+"/?lang=" + lang +"&ulogId="+uId)
  }

  getVisaDetails(id,lang): Observable<any>{
    return this.http
    .get("custom_trip_booking/"+id+"/update_mutamer_info/?lang=" + lang)
  }

  getInvoice(id): Observable<any>{
    return this.http
    .get("bookings/"+id+"/invoice_template/",{responseType:'blob'})
  }

  generateShareLink(id,data,uId): Observable<any> {
    return this.http
      .post("custom_trips/" + id + "/generate_trip_link/"+"?ulogId="+uId,data)
  }

  getShortenUrl(data,uId): Observable<any> {
    return this.http
      .post("shortenurl/"+"?ulogId="+uId, data)
  }

  getConfirmCancellation(id,data): Observable<any>{
    return this.http
    .post("b2b_trip_booking/"+id+"/confirm_cancellation/",data)
  }

  getCheckCancellation(id,lang): Observable<any>{
    return this.http
    .get("b2b_trip_booking/"+id+"/check_cancellation/?lang=" + lang)
  }


  getVoucher(id): Observable<any>{
    return this.http
    .get("bookings/"+id+"/voucher_template/",{responseType:'blob'})
  }
 //this method is for getting response in terms of blob
  // getInvoicePdf(id,lang): Observable<any>{
  //   return this.http
  //   .get("bookings/"+id+"/invoice/?lang=" + lang,{responseType:'blob'})
  // }

  getInvoicePdf(id,vat,lang): Observable<any>{
    return this.http
    .get("bookings/"+id+"/invoice/?vat_number= "+vat+"&lang=" + lang,{responseType:'blob'})
  }


  sendNotification(id:any): Observable<any> {
    return this.http
      .get( "bookings/"+id+"/resend_notification/")
  }


  bookTrip(data,id,lang,uId): Observable<any>{
    return this.http
    .post( "custom_trips/" + id + "/booking/?lang=" + lang+"&ulogId="+uId,data)
  }


  searchTransport(data,lang,uId): Observable<any> {
    return this.http
      .post( "ground_transports/search/?lang=" + lang +"&ulogId="+uId, data)
  }


  searchTransportList(id,currency,lang,uId): Observable<any> {
    return this.http
      .get("ground_transports/?search_id=" + id + "&currency=" + currency + "&lang=" + lang+"&ulogId="+uId)
  }


  getTrip(id,lang,uId): Observable<any>{
    return this.http
    .get("offline_hotels/custom_trips/" + id + "/"+ "?lang=" + lang+"&ulogId="+uId)
  }


  checkAvailability(id,uId): Observable<any>{
    return this.http
    .get("b2b_trip_booking/"+id+"/check_availability/"+"?ulogId="+uId)
  }

  bookingPayment(data,uId): Observable<any>{
    return this.http
    .post( "payments/"+"?ulogId="+uId,data)
  }

  bookingStatus(id,lang,uId): Observable<any>{
    return this.http
    .get("bookings/"+id+"/check_status/?lang="+lang+"&ulogId="+uId)
  }

  getCategories(lang): Observable<any> {
    return this.http
      .get( "ground_transports/categories/?lang=" + lang)
  }

  getAdditionalServices(lang): Observable<any> {
    return this.http
      .get(+ "ground_transports/additional_services/?lang=" + lang )
  }

  getserviceAdditionalServices(): Observable<any> {
    return this.http
      .get("ground_services/additional_services/")
  }

  v2_5PilotHotelSearch(data: any, lang: any,id:any): Observable<any> {
    return this.http
      .post( "hotels/v2.5/search/?lang=" + lang+"&ulogId="+id, data)
  }

  v2_5GetHotelList(id: any, lang: any,uId:any): Observable<any> {
    return this.http
      .get("hotels/v2.5/?search_id=" + id  + "&lang=" + lang+"&ulogId="+uId)
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

  getPaginatedhistoryList(pageNumber: number,lang): Observable<any> {
    return this.http.get( 'bookings/?page=' + pageNumber + "&lang=" + lang)
  }

  getIbanDetails(lang): Observable<any> {
    return this.http.get( 'account/balance_enquiry/?lang=' + lang)
  }

  getIbanHistory(from,to,lang): Observable<any> {
    return this.http.get( 'account/account_statement/?from_date='+from+'&to_date='+to+'&lang=' + lang)
  }

  getAirportListSrc(airport: String): Observable<any> {
    return this.http.get<listAirport[]>( "airports/autocomplete/?airport_type=DESTINATION&airport_type=BOARDING&search=" + airport);
  }

  getairlineslist(airline: String): Observable<any> {
    return this.http.get("airlines/autocomplete/?search=" + airline);
  }

  getRoutes(lang): Observable<any> {
    return this.http
      .get("ground_transports/routes/?lang=" + lang)
  }

  getVehicles(lang): Observable<any> {
    return this.http
      .get("ground_transports/vehicle_types/?lang=" + lang)
  }

  getHotelNameList(name:string): Observable<any> {
    return this.http
      .get("statichotel/autocomplete/?search=" + name)
  }

  postSubPcc(data: any,id): Observable<any> {
    return this.http
      .post( "subpcc/"+"?ulogId="+id, data)
  }

  patchSubPcc(data: any,id,uid): Observable<any> {
    return this.http
      .patch( "subpcc/"+id+"/"+"?ulogId="+uid, data)
  }

  getSubPcc(id): Observable<any> {
    return this.http
      .get("subpcc/"+"?ulogId="+id)
  }

  deleteSubPcc(id,uid) {
    return this.http.delete( "subpcc/"+id+"/"+"?ulogId="+uid)
  }

  getSubPccList(checkIn,checkOut,uid){
    return this.http.get("subpcc/?from_date="+checkIn+"&to_date="+checkOut+"&ulogId="+uid)
  }

  getCurrentSalesReport(data){
    return this.http.post("staff/sales/",data)
  }

  updateProfile(data){
    return this.http
    .patch( "staff/edit_profile/", data)
  }

  changePassword(data){
    return this.http
      .post( "staff/change_password/", data)
  }
  generateReport(data){
    return this.http
      .post( "bookings/transactions/", data)
  }
  getReport(){
    return this.http.get( "bookings/transactions/")
  }

  updateProfileImage(imageFile: File,id){
    const formData: FormData = new FormData();
    formData.append('logo_photo',imageFile);
    return this.http.post('agencies/agency_logo/',formData)
  }

  makeFavorite(data: any): Observable<any> {
    return this.http.post( "favorite/", data)
  }

  bookingRequestAgencyList(){
    return this.http.get( "custom_trips/umrah_operators_lists/")
  }
}