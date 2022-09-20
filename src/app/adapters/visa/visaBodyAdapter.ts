import { DatePipe } from "@angular/common";

export class VisaBodyAdapter {

    constructor(public datepipe:DatePipe){

    }

    travellerDetailsBody(data){
        let traveller = {
            id:data.PassengerID,
            dob:this.dateFormater(data.DOB),
            nationality:data.Nationality,
            country_of_residence:data.Country,
            passport_no:data.PassportNo,
            passport_expiry_date:this.dateFormater(data.DOE),
            passport_city:data.PIP,
            first_name:data.FirstName,
            last_name:data.LastName,
            middle_name:data.MiddleName,
            address:data.Address,
            husband_name:data.HusbandName,
            father_name:data.FatherName,
            mother_name:data.MotherName,
            date_of_issue:this.dateFormater(data.DOI),
            birth_place:data.POB,
            city:data.City,
            passport_type:data.PassportType,
            first_name_ar:data.FirstNameArabic,
            last_name_ar:data.LastNameArabic,
            middle_name_ar:data.MiddleNameArabic,
            gender:data.Gender,
            passport_city_ar:data.PIPArabic,
            husband_name_ar:data.HusbandNameArabic,
            father_name_ar:data.FatherNameArabic,
            mother_name_ar:data.MotherNameArabic,
            birth_place_ar:data.POBArabic,
        }
        
        let body = {
            travellers : [traveller]
        }

        return body;
    }

    passportImgUploadBody(data){
        let body = {
            front:data.passportFrontFile,
            back:data.passportBackFile,
            photo:data.PersonalPhotoFile
        }
        return body
    }

    documentUpload(data){
        let body = {
            vaccin:data.vaccinationCertificateFile,
        }
        console.log(body);
        
        return body
    }

    dateFormater(date: any) {
        let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
        return latest_date;
    }
}