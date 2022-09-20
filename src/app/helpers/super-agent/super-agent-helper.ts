export class SuperAgentHelperService {
    today = new Date();

    constructor(){}

    setCreatePackageList(pdays,mkdays,mddays,date){
        var start_date = date;
        var end_date = this.incrementDate(start_date,pdays);
        var flight_start_date = date;
        var flight_end_date = this.incrementDate(flight_start_date,pdays);
        var mk_start = start_date;
        var mk_end = this.incrementDate(mk_start,mkdays);
        var md_start = this.incrementDate(mk_end,1);
        var md_end = this.incrementDate(md_start,mddays);

        var values = {
            start_date:start_date,
            end_date:end_date,
            flight_start:flight_start_date,
            flight_end:flight_end_date,
            mk_start:mk_start,
            mk_end:mk_end,
            md_start:md_start,
            md_end:md_end,
        }
        return values;
    }

    incrementDate(date,days) {
        var d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }
}