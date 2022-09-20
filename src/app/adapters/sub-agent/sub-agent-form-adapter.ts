import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SubAgentFormService } from "src/app/Services/sub-agent-form/sub-agent-form-service";

export class SubAgentFrmAdapter {

    constructor(private fb: FormBuilder) { }

    leaderForm(){
        return this.fb.group({
            title:["",Validators.required],
            first_name:["",[Validators.required, Validators.minLength(3)]],
            last_name:["",[Validators.required, Validators.minLength(3)]],
            nationality:["",Validators.required],
            passport_no:[""],
            tag:[""],
            dob:["2015-05-14"],
            passport_expiry_date:[""],
            email:[""],
            countryOFRecidence:[""],
            phone_number:[""],
            phone_country_code:[""],
            phone_country_iso_code:[""],
            whatsappSend:["0"]
        })
    }

}