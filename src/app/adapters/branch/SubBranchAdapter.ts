import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

export class subBranchAdapter {
    fb: FormBuilder;
    today:Date = new Date();

    constructor(private datePipe:DatePipe){}

    createBranchForm(){
        this.fb = new FormBuilder();
        return this.fb.group({
            fname: ["", Validators.required],
            lname: ["", Validators.required],
            adress: ["", Validators.required],
            phn_country_code : ["", Validators.required],
            email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            phone: ["",Validators.required],
            advance_pay: ["",Validators.required],
        })
    }

    bookPackageForm(){
      this.fb = new FormBuilder();
      return this.fb.group({
          fname: ["", Validators.required],
          lname: ["", Validators.required],
          phn_country_code : ["", Validators.required],
          email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
          phone: ["",Validators.required],
          adult: [1,Validators.required],
          childWithBed: [0],
          ChildWithoutBed: [0],
          transportSelect:[0],
          makkahSelect:[0],
          makkahDays:[0],
          makkahPrice:[0],
          makkahRooms:[0],
          madeenaSelect:[0],
          madeenaDays:[0],
          madeenaPrice:[0],
          madeenaRooms:[0],
          foodSelect:[1],
          foodDays:[0],
          foodPrice:[0]
      })
  }

    paymentBody(value:any,advance:number){
        var day = this.datePipe.transform(this.today, "yyyy/MM/dd");
        var body ={
            "advance_amount":advance,
	        "adults":+sessionStorage.getItem("bookAdult"),
	        "children_with_bed":+sessionStorage.getItem("bookChildWithBed"),
	        "children_without_bed":+sessionStorage.getItem("bookChildWithoutBed"),
            "infants":0,
            "booking_date":day,
	        "contactinfo": {
                "title": "Mr",
                "first_name": value.fname,
                "last_name": value.lname,
                "phone_number": value.phone,
                "email": value.email,
                "phn_country_code":value.phn_country_code,
                "address":value.adress,
                "is_guest": true
            }
        }
        return body;
    }
}
