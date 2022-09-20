import { DatePipe } from "@angular/common"

export class SubAgentDateTimeHelper {

    constructor(private datepipe:DatePipe){}

    dateFormaterMdy(date: any) {
        let latest_date = this.datepipe.transform(date, "MM/dd/yyyy");
        return latest_date;
    }

    dateFormaterMdyHma(date: Date) {
        let latest_date = this.datepipe.transform(date, "MM/dd/yyyy,hh:mm a");
        return latest_date;
    }

    dateFormaterYMd(date: any) {
        let latest_date = this.datepipe.transform(date, "yyyy-MM-dd");
        return latest_date;
    }

    dateTimeStringToTimeStampConverter(date:any){
        var date1 = Date.parse(date);
        return Math.ceil(date1/1000);
    }

    noOfDaysBetweenTwoDates(firstDate,secondDate) {
        var a,b,c,d,noOfDays;
        a = this.dateFormaterMdy(firstDate);
        b = this.dateFormaterMdy(secondDate);
        c = new Date(a.split("/")[2],a.split("/")[0] - 1,a.split("/")[1]);
        d = new Date(b.split("/")[2],b.split("/")[0] - 1,b.split("/")[1]);
        return noOfDays = Math.round(Math.abs((c - d) / (24 * 60 * 60 * 1000)));
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    incrementDate(date,days) {
        var d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }

    incrimentmonth(date,months){
        var y = new Date(date);
        var z = y.setMonth(y.getMonth() + months)
        return new Date(z);
    }

    dicrimentMonth(date,months){
        var y = new Date(date);
        var z = y.setMonth(y.getMonth() - months)
        return new Date(z);
    }

    timeStampToDateConversion(s){
        let d = new Date(s*1000) 
        return this.dateFormaterMdy(d)
    }

    daysofTwoDate(dt1,dt2){
      var date1 = new Date(dt1);
      var date2 = new Date(dt2);
      var Difference_In_Time = date2.getTime() - date1.getTime();
      return  Difference_In_Time / (1000 * 3600 * 24);
    }

    priceConversion(amount){
        var value = JSON.parse(sessionStorage.getItem('currencySelect'))
        var decimalpoint:number = +value.precision;
        var rate:number = +value.rate;
        var total = amount * rate;
        return (Math.round(total * 100) / 100).toFixed(decimalpoint);
    }

}