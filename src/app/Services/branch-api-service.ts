import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Headers,Http, ResponseContentType } from "@angular/http";
import{ Observable} from   "rxjs"

@Injectable()
export class BranchApiService{
    BASE_URL:any = environment.baseUrl;
    BASE_URL2:any = environment.baseUrl2;
    options = {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("accesstoken"),
        }),
    };
    optionContent = {
      headers : new Headers({
        Authorization: "Bearer " + localStorage.getItem('accesstoken'),
       })
    }

    constructor(private http: Http){}

    getPackages(page){
      //?page=" + (page!=null && page!=undefined?page:"1") + "/"
      return this.http.get(this.BASE_URL + "master_package/" + "?page=" + (page!=null && page!=undefined?page:"1") , this.options).map(res => res.json());
    }

    getB2bPackages(page,filter,ordering){
      return this.http.get(this.BASE_URL + "b2b_branch_master_package/" + "?page=" + page + filter + ordering, this.options).map(res => res.json());
    }

    getPackageDetails(id){
      return this.http
        .get(this.BASE_URL + "package/"+id+"/", this.options)
        .map((res) => res.json());
    }

    getPackageAvilability(id){
      return this.http
        .get(this.BASE_URL + "package/"+id+"/package_availabilty_branch/", this.options)
        .map((res) => res.json());
    }

    getMasterPackageDetails(id){
      return this.http
        .get(this.BASE_URL + "master_package/"+id+"/", this.options)
        .map((res) => res.json());
    }

    getB2BMasterPackageDetails(id){
      return this.http
        .get(this.BASE_URL + "b2b_branch_master_package/"+id+"/", this.options)
        .map((res) => res.json());
    }

    packagePricing(data,id,currency){
      return this.http
        .post(this.BASE_URL + "package/"+id+"/prices/?currency="+currency, data, this.options)
        .map((res) => res.json());
    }

    bookPackage(data){
      return this.http
        .post(this.BASE_URL + "b2b_package_booking/", data, this.options)
        .map((res) => res.json());
    }

    packagePayment(id){
      return this.http
        .post(this.BASE_URL + "b2capis/package/payment/", {"booking_id": id}, this.options)
        .map((res) => res.json());
    }

    getBookingDetails(Bid){
      return this.http
        .get(this.BASE_URL + "b2b_package_booking/"+Bid+"/", this.options)
        .map((res) => res.json());
    }

    paginateBoogingsList(page){
      return this.http
        .get(this.BASE_URL + "b2b_package_booking/?page="+page, this.options)
        .map((res) => res.json());
    }

    paginateBoogingsListSearch(page,search){
      return this.http
        .get(this.BASE_URL + "b2b_package_booking/?page="+page+search, this.options)
        .map((res) => res.json());
    }

    getBookingTravelerDetails(id){
      return this.http.get(
        this.BASE_URL +
          "b2b_package_booking/" + id + "/traveller_details/",
        this.options
      );
    }

    visaRequestSend(id){
      return this.http
        .get(this.BASE_URL + "b2b_package_booking/"+id+"/visa_request/", this.options)
        .map((res) => res.json());
    }
  
    postTravellerPassportDetails(id,body){
      return this.http.post(this.BASE_URL + 'b2b_package_booking/'+id+'/traveller/', body, this.options).map(res => res.json());
    }

    postImageTravellersPassport(id,body){
      const formData: FormData = new FormData();
      if(body.front != ''){
        formData.append(`passport_front`,body.front);
      }
      if(body.back != ''){
        formData.append(`passport_back`,body.back);
      }
      if(body.photo != ''){
        formData.append(`passport_photo`,body.photo);
      }
      return this.http.post(this.BASE_URL + 'passport/'+id+'/upload/', formData,this.optionContent).map(res => res.json());
    }

    postDocumentTravellersPassport(id,body){
      console.log(body);
      
      const formData: FormData = new FormData();
      formData.append(`[documents][0][file]`, body.vaccin);
      formData.append(`[documents][0][doc_type]`, 'vaccination certificate');
      return this.http.post(this.BASE_URL + 'passport/'+id+'/upload/', formData,this.optionContent).map(res => res.json());
    }

    getProfile(){
      return this.http
        .get(this.BASE_URL + "staff/profile/", this.options)
        .map((res) => res.json());
    }

    getBookings(){
      return this.http
        .get(this.BASE_URL + "b2bpackage/booking_packages/", this.options)
        .map((res) => res.json());
    }

    executeArabicTranslate(res){
      return this.http.get('https://smart.gdrfad.gov.ae/SmartChannels/rest/AjaxHelpers/Translate?text='+res,{responseType:ResponseContentType.Text})
      .map((res:any) => {return res._body});
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
    getPassportFrontAutomationv2(data){
      const formData: FormData = new FormData();
      formData.append(`file`,data);
      var  optionContent = {
        headers : new Headers({
         "Content-Type":"multipart/form-data",
         Authorization: "Bearer " + localStorage.getItem('accesstoken'),
         "X-API-KEY":"m*pHGTT7Mn=jmSf3T@"
        })
      }
      return this.http.post(this.BASE_URL + 'passport/front_v2/', formData,optionContent).map(res => res.json());
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

}
