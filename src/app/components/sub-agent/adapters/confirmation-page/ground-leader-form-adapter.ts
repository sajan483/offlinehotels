import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class SubAgentGroundLeaderFormAdapter {

    constructor(private fb: FormBuilder) { }

    leaderForm(){
        return this.fb.group({
            title:["",Validators.required],
            first_name:["",[Validators.required, Validators.minLength(3)]],
            last_name:["",[Validators.required, Validators.minLength(3)]],
            nationality:["",Validators.required],
            for_booking_tag:[""],
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