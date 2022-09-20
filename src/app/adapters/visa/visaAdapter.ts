import { FormBuilder, Validators } from "@angular/forms";
import { requireMatch } from "src/app/helpers/requirematch_validator";
import { VisaStateService } from "src/app/Services/visa-service/visa-state-service";

export class VisaAdapter {

    constructor(private fb: FormBuilder, private stateService: VisaStateService) { }

    visaItineray():void {
        this.stateService.visaItinerayForm = this.fb.group({
            Pax: this.fb.array([])
        })
    }

    viasPaxDetails(nationalities:any[]){
        return this.fb.group({
            filled:[false],
            PassengerID:[""],
            passportFrontUrl:["",Validators.required],
            passportFrontFile:[""],
            passportFrontMrz:[""],
            PassportType:["P",Validators.required],
            PassportNo:["",Validators.required],
            FirstName: ["",Validators.required],
            FirstNameArabic:["",Validators.required],
            MiddleName: [""],
            MiddleNameArabic:[""],
            LastName: ["",Validators.required],
            LastNameArabic:["",Validators.required],
            Nationality:["",[Validators.required,requireMatch(nationalities)]],
            Gender:["",Validators.required],
            DOB:["",Validators.required],
            POB: ["",Validators.required],
            POBArabic:["",Validators.required],
            PIP: ["",Validators.required],
            PIPArabic:["",Validators.required],
            DOI:["",Validators.required],
            DOE:["",Validators.required],
            passportBackUrl:[""],
            passportBackFile:[""],
            FatherName: [""],
            MotherName: [""],
            HusbandName: [""],
            FatherNameArabic: [""],
            MotherNameArabic: [""],
            HusbandNameArabic: [""],
            Address: [""],
            City: [""],
            Country: [""],
            PersonalPhotoUrl: ["",Validators.required],
            PersonalPhotoFile: [""],
            vaccinationCertificate:[""],
            vaccinationCertificateFile:[""],
            AdditionalDocUrl: this.fb.array([]),
            NationalitySearch:[""]
        })
    }

    addAdditionalUrl(url,file){
        return this.fb.group({
            docData:url,
            docDataFile:file
        })
    }
}