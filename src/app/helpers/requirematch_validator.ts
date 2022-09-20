import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';  

export function requireMatch(nationalities:any[]): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {  
        if(nationalities.filter((e)=>e.name.toLowerCase()==control.value.toLowerCase()).length==0){
            return {requireMatch:true}
        }
        return null;  
    }  
}