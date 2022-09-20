export class SubAgentCancellationBar {

    today = new Date().getTime()/1000;

    constructor() { }

    setCancellationBarData(data: any) {
        let cancellationData = [];
        data.forEach((x,i) => {
            if(i == 0){
               if(this.today < new Date(x.from_date_time).getTime()/1000){ 
                let data = {
                    date: x.from_date_time,
                    amound: 0,
                    text: "Fully Refundable",
                    isText: true,
                    colortext: "#01953c"
                }
                cancellationData.push(data);
               }
            }
            cancellationData.push(this.setValue(x));
        });
        return cancellationData;
    }

    setValue(x:any){
        let data = {
            date: x.to_date_time,
            amound: 0,
            text: "",
            isText: true,
            colortext: "#d69e15"
        }

        if(x.charge.chargeValue == 100){
            data.text = "Non Refundable";
            data.colortext = "#ff0000";
            data.isText = true;
        }else if(x.charge.chargeValue == 0){
            data.text = "Fully Refundable";
            data.colortext = "#01953c";
            data.isText = true;
        }else{
            if(x.charge.chargeAmount > 0){
                data.amound = x.charge.chargeAmount;
                data.isText = false;
                data.colortext = "#d69e15"
            }else{
                data.text = x.charge.chargeValue + "% Deduction";
                data.isText = true;
                data.colortext = "#d69e15"
            }
        }
        return data;
    }
}