import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { HttpClient} from "@angular/common/http";
import { Observable } from "rxjs";
import { listAirport } from "../models/listAirport";
import { environment } from "src/environments/environment";
import { Http,Headers} from "@angular/http";

@Injectable()
export class SuperAgentApiService {
  BASE_URL: any = environment.baseUrl;
  BASE_URL2: any = environment.baseUrl2;
  APP_URL1:any = 'https://app.umrahtrip.com/api/v1/';
  APP_URL3:any = 'https://app.umrahtrip.com/api/v3/';

  constructor(
    private router: Router,
    private https: HttpClient,
    private http:Http
  ) {}

  searchFlights(data: any) {
    return this.https.post(this.BASE_URL + "flights/search/", data);
  }

  getAirportListSrc(airport: String): Observable<any> {
    return this.https.get<listAirport[]>(this.BASE_URL + "airports/autocomplete/?search=" + airport);
  }

  getairlineslist(airline: String): Observable<any> {
    return this.https.get(this.BASE_URL + "airlines/autocomplete/?search=" + airline);
  }

  agencyHotelSearch(data: any, lang: any) {
    return this.https.post(this.BASE_URL + "packages/hotels/search/?lang=" + lang, data);
  }

  createPackage(data,currency,lang) {
    return this.https.post(this.BASE_URL + "package/?currency=" + currency + "&lang=" + lang, data)
  }

  updatePackageAPI(data,id){
    return this.https.put(this.BASE_URL + "package/"+id+"/", data)
  }

  flight_availability_add(data) {
    return this.https.post(this.BASE_URL + "package_flight_avaialability/", data)
  }

  hotel_availability_add(data) {
    return this.https.post(this.BASE_URL + "package_hotel_avaialability/", data)
  }

  transport_availability_add(data) {
    return this.https.post(this.BASE_URL + "package_transport_availability/", data)
  }

  visa_availability_add(data) {
    return this.https.post(this.BASE_URL + "package_visa_availability/", data)
  }

  createMasterPackage(data){
    return this.https.post(this.BASE_URL + "master_package/", data)
  }

  updateMasterPackage(data,mid){
    return this.https.put(this.BASE_URL + "master_package/"+mid+"/", data)
  }

  uploadTripImage(data,mid){
    let formData = new FormData();
    formData.append( `images`, data[0].file)
    return this.https.put(this.BASE_URL + "master_package/"+mid+"/upload_images/",formData);
  }

  uploadTripImageId(data,mid){
    let formData = new FormData();
    formData.append( `images_id`, data)
    return this.https.put(this.BASE_URL + "master_package/"+mid+"/upload_images/",formData);
  }

  uploadImageCollection(data,mid){
    let formData = new FormData();
    data.forEach((item,index) => {
      formData.append(`image_collections`, item);
    });
    return this.https.put(this.BASE_URL + "master_package/"+mid+"/upload_images/",formData);
  }

  uploadImageCollectionById(data,mid){
    let formData = new FormData();
    data.forEach((item,index) => {formData.append(`image_collections_id`, item);});
    return this.https.put(this.BASE_URL + "master_package/"+mid+"/upload_images/",formData);
  }

  removeImageInCollection(data,mid){
    return this.https.post(this.BASE_URL + "master_package/"+mid+"/remove_image/", data)
  }

  getMasterPackages(){
    return this.https.get(this.BASE_URL + "master_package/" )
  }

  getMasterPackageById(id){
    return this.https.get(this.BASE_URL + "master_package/"+id+"/" )
  }

  getPackageCategories(lang){
    return this.https.get(this.BASE_URL + "packages/categories/?lang=" + lang)
  }

  getVisaType(){
    return this.https.get(this.BASE_URL + "visa_types/")
  }

  getPackageDetails(id){
    return this.https.get(this.BASE_URL + "package/"+id+"/")
  }

  getPackageBookingDetails(id){
    return this.https.get(this.BASE_URL + "adminpackagebookings/"+id+"/")
  }

  getPackageHotelInfo(data,currency,lang) {
    return this.https.post(this.BASE_URL + "packages/hotels/details/?currency=" + currency + "&lang=" + lang, data)
  }

  searchSSRFlights(data: any) {
    return this.https.post(this.BASE_URL + "flights/flight_ssr/", data)
  }

  getFareRules(data: any) {
    return this.https.post(this.BASE_URL + "b2capis/flights/fare_rules/", data)
  }

  publishPackage(data: any,id:number) {
    return this.https.put(this.BASE_URL +  "package/"+id+"/", data)
  }

  availabilityAdd(data,id){
    return this.https.post(this.BASE_URL +  "package/"+id+"/package_availabilty/", data)
  }

  getPackageAvilability(id){
    return this.https.get(this.BASE_URL + "package/"+id+"/package_availabilty/")
  }

  getBranchlist(lang){
    return this.https.get(this.BASE_URL + 'branches/?lang=' + lang)
  }

  getPaginatedStaffList(pageNumber: number, lang) {
    return this.https.get(this.BASE_URL + 'staff/?search=&role=&page=' + pageNumber + '&lang=' + lang)
  }

  getAgency(){
    return this.https.get(this.BASE_URL + 'agencies/')
  }

  branchCreation(data){
    return this.https.post(this.BASE_URL + "branches/", data)
  }

  getSelectedBranch(id: any) {
    return this.https.get(this.BASE_URL + 'branches/' + id + '/')
  }

  updateBranch(id: any, data: any) {
    return this.https.put(this.BASE_URL + 'branches/' + id + '/', data)
  }

  staffRegister(data:any){
    return this.https.post(this.BASE_URL + "staff/", data)
  }

  getAccountHistory() {
    return this.https.get(this.BASE_URL + 'account/account_statement/')
  }

  getAccountDateHistory(fromdate:string,todate:string) {
    return this.https.get(this.BASE_URL + 'account/account_statement/?from_date='+fromdate+'&to_date='+todate)
  }

  getAgencyApprovedDetails(id:any) {
    return this.https.get(this.BASE_URL + "agencies/"+id+"/approval_details/")
  }

  getSalesOverView(month) {
    return this.https.get(this.BASE_URL2 +'dashboard/overview/?month='+month)
  }

  forItinerarySetAPI(param,id){
    let formData = new FormData();
    param.forEach((item,index) => {
          if(item.title){
            formData.append(`[package_itineraries][${index}][title]`, item.title);
          }
          if(item.noOfDays){
            formData.append(`[package_itineraries][${index}][day_number]`, item.noOfDays);
          }
          if(item.details){
            formData.append(`[package_itineraries][${index}][details]`, item.details);
          }
          if(item.attachments){
            formData.append(`[package_itineraries][${index}][attachments][0][file]`, item.attachments);
          }
        });
    return this.https.put(this.BASE_URL + "master_package/"+id+"/upload_images/",formData);
  }

  getServiceCategory() {
    return this.https.get(this.APP_URL1 + 'categories')
  }

  getCategoryChild(id){
    return this.https.get(this.APP_URL1 + 'categories/childes/' + id)
  }

  getRestaurantsList() {
    return this.https.get(this.APP_URL1 + 'restaurants/get-restaurants/all?offset=0&limit=10&btype=b2b')
  }

  appConfig() {
    return this.https.get(this.APP_URL1 + 'config')
  }

  getCategoryService() {
    return this.https.get(this.APP_URL3 + 'items')
  }

  getItemsValues(id,offset) {
    return this.https.get(this.APP_URL1 + 'categories/products/'+id+'?limit=10&offset='+offset)
  }


  getEnquiries(page:any): Observable<any> {
    return this.https.get<any>(this.BASE_URL +"package_enquiry/" + (page!=null?"?page="+page:""));
  }

  filterEnquiries(search): Observable<any> {
    return this.https.get<any>(this.BASE_URL +"package_enquiry/"+search);
  }
  
  markEnquiryAsRead(id): Observable<any> {
    return this.https.put<any>(
      this.BASE_URL + "package_enquiry/"+id+"/readed_status/",{"mark_as_read": true});
  }

  changeEnquiryStatus(id,status): Observable<any> {
    return this.https.put<any>(
      this.BASE_URL + "package_enquiry/"+id+"/readed_status/",{ "enquiry_status": status }
    );
  }

  getBookings(page:any): Observable<any> {
    return this.https.get<any>(
      this.BASE_URL + "superagent_package_booking/" + (page!=null?"?page="+page:""));
  }

  getBookingDetails(id){
    return this.https.get<any>(
      this.BASE_URL +"superagent_package_booking/" + id + "/");
  }

  resentMail(id,mail){
    return this.https.get<any>(
      this.BASE_URL + "b2b_package_booking/" + id + "/send_mail/?custom_mail="+mail
    );
  }

  getBookingTravelerDetails(id){
    return this.https.get<any>(
      this.BASE_URL +"superagent_package_booking/" + id + "/traveller_details/");
  }

  postTravellerPassportDetails(id,body){
    return this.https.post(this.BASE_URL + 'superagent_package_booking/'+id+'/traveller/', body)
  }

  searchBookings(search){
    return this.https.get<any>(
      this.BASE_URL + "superagent_package_booking/"+search
    );
  }

  getMasterPackageBookings(id,page){
    return this.https.get<any>(
      this.BASE_URL +"b2b_package_booking/master_package/" + id + "/?page="+page);
  }

  getPackageBookings(id,page){
    return this.https.get<any>(
      this.BASE_URL +"b2b_package_booking/package_detail/" + id + "/?page="+page
    );
  }

  deactivePackage(data,id){
    return this.https.post(this.BASE_URL + 'package/'+id+'/admin_package_disable/', data)
  }

  duplicatePackage(item){
    return this.https.post<any>(this.BASE_URL + "master_package/"+item.id+"/package_duplicating/", {});
  }

  enableDisablePackage(id){
    return this.https.post<any>(this.BASE_URL + "master_package/"+id+"/change_status/", {});
  }

  searchTransportList(data: any) {
    return this.https.post(this.BASE_URL + 'packages/ground_transports/search/', data)
  }

  filterMasterPackage(data,page){
    return this.https.get(this.BASE_URL + "master_package/?page="+page+data )
  }


  getPassportFrontAutomation(data){
    const formData: FormData = new FormData();
    formData.append(`file`,data);
    var  optionContent = {
      headers : new Headers({
       //"Content-Type":"multipart/form-data",
       Authorization: "Bearer " + localStorage.getItem('accesstoken'),
      })
    }
    return this.http.post(this.BASE_URL + 'passport_front/', formData,optionContent).map(res => res.json());
  }

  getPassportBackAutomation(data){
    const formData: FormData = new FormData();
    formData.append(`file`,data);
    var  optionContent = {
      headers : new Headers({
       //"Content-Type":"multipart/form-data",
       Authorization: "Bearer " + localStorage.getItem('accesstoken'),
      })
    }
    return this.http.post(this.BASE_URL + 'passport_back/', formData,optionContent).map(res => res.json());
  }

  postPassportImage(front,back,id){
    const formData: FormData = new FormData();
    if(front != ""){
      formData.append(`passport_front`,front);
    }
    if(back != ""){
      formData.append(`passport_back`,back);
    }
    var  optionContent = {
      headers : new Headers({
       //"Content-Type":"multipart/form-data",
       Authorization: "Bearer " + localStorage.getItem('accesstoken'),
      })
    }
    return this.http.post(this.BASE_URL + 'passport/'+id+'/upload/', formData,optionContent).map(res => res.json());
  }

  getVisaList(id,page){
    return this.https.get(this.BASE_URL + "superagent_package_booking/package/"+id+"/visa_status/?page="+page )
  }

  downloadVisaData(id){
    return this.https.get(this.BASE_URL + "superagent_package_booking/package/"+id+"/download_visa_request/",{observe: 'response', responseType: 'blob'})
  }

  getPackageForDropdown(title,referenceCode){
    return this.https.get(this.BASE_URL + "superagent_package_booking/package_booking_minimum_list/?title="+(title?title:'')+"&reference_code="+(referenceCode?referenceCode:''))
  }

  createMofa(data:any){
    return this.https.post(this.BASE_URL + "mofa_account/",data);
  }

  updateMofa(id,data:any){
    return this.https.post(this.BASE_URL + "mofa_account/"+id+"/",data);
  }

  getMofa(){
    return this.https.get(this.BASE_URL + "mofa_account/");
  }

  createGroup(data:any){
    return this.https.post(this.BASE_URL + "mofa_group/",data);
  }

  getGroups(){
    return this.https.get(this.BASE_URL + "mofa_group/");
  }
}