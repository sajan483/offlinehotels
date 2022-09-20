export class branchHelper{
    constructor(){}

    incrementDate(date,days) {
        var d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }
}