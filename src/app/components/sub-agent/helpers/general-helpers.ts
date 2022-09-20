import { DatePipe } from "@angular/common";
export class SubAgentGeneralHelpers {
    
    constructor(private datepipe: DatePipe){}


    incrementDate(date, days) {
        let d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }

    _filterStatesD(value: string, statesD): any[] {
        const filterValue = value.toLowerCase();

        return statesD.filter(
            (state) => state.city.toLowerCase().indexOf(filterValue) === 0
        );
    }

    commonDateFormater(date: any,format:string) {
        let latest_date = this.datepipe.transform(date,format);
        return latest_date;
      }

      _filterFromLocations(value: string,statesD): any[] {
        const filterValue = value.toLowerCase();
  
        return statesD.filter(
          (state) => state.name.toLowerCase().indexOf(filterValue) === 0
        );
      }

      dateFormaterMdy(date: any) {
        let latest_date = this.datepipe.transform(date, "MM/dd/yyyy");
        return latest_date;
    }

}