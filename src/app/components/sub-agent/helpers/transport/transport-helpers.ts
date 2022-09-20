import { FilterCategoryTransport, FilterVehicleTypeList, FilterVehicleModel, FilterAdditionalServiceTransport, TransportFilterData, TransportFilterPostData } from "../../models/transportListModel";

export class SubAgentTransportListHelper {

    constructor(){}

    setDatasForList(data:any,fromCache:boolean){
        let transportList = [];
        data.forEach(x=> x.vehicle_types.forEach(y=>{
            y.company_code = x.company_code,y.company_name = x.company_name,
            y.policies = x.policies,y.cancellation_policy = x.cancellation_policy,
            y.price = y.categories[0].fare_summary[2].amount
        }))
        let q = data.map(x=>x.vehicle_types)
        transportList = q.concat.apply([],q).sort((a,b) =>(a.price) - (b.price));
        transportList.forEach((ct)=>{ct.categories.forEach((fs)=>{fs.fare_summary.forEach((amt)=>{if(amt.is_total) {amt.display_price = amt.amount; ct.display_price=amt.amount; ct.category_name = fs.category_name}})})})
        transportList.forEach(x=>{x.active = true,x.fromCache = fromCache});
        return transportList;
    }

    addAdditionalService(evt:any,aditionalService:any,transportList:any[]){
        let i = evt.index;
        let data = evt.data;
        let key = evt.key;
        let addSrvicePrice:number = 0;

        if (evt.checked) {
            var obj: any = {};
            if(aditionalService.keys != undefined && aditionalService.keys.contains(key)){
                aditionalService[key].push(data.categories[0].additional_services[0].additional_service_code);
            }else{
                aditionalService[key] = [];
                aditionalService[key].push(data.categories[0].additional_services[0].additional_service_code);
            }
            addSrvicePrice = data.categories[0].additional_services[0].fare_summary[2].amount
            if (addSrvicePrice > 0) {
                obj.name = "Additional Services";
                obj.currency = "SAR";
                obj.amount = addSrvicePrice;
            }
            transportList[i].categories.forEach((fs) => { fs.fare_summary.push(obj) });
            transportList[i].categories.forEach((as) => { as.additional_services.forEach(fs => { fs.fare_summary.forEach((amt) => { if (amt.is_total) { transportList[i].display_price = transportList[i].display_price + addSrvicePrice; } }) }) })
            transportList[i].categories[0].display_fare_summary.additional_service_amount = addSrvicePrice
        } else {
        let removeIndex = aditionalService[key].findIndex(itm => itm === data.categories[0].additional_services[0].additional_service_code);
        if (removeIndex !== -1) {
                transportList[i].categories.forEach((as) => { as.additional_services.forEach(fs => { fs.fare_summary.forEach((amt) => { if (amt.is_total) { transportList[i].display_price = transportList[i].display_price - amt.amount; } }) }) })
                if (addSrvicePrice > 0) { transportList[i].categories.forEach((fs) => { fs.fare_summary.splice((fs.fare_summary.length - 1), 1) }); }
                delete transportList[i].categories[0].display_fare_summary.additional_service_amount;
                aditionalService[key].splice(removeIndex, 1);
            }
        }

        let x = {
            aditionalService:aditionalService,
            transportList:transportList
        }
        return x;
    }

    initialDataForFilterTransport(transport:any[],vehicleList:any[]){

        let filterVehicleType:FilterVehicleTypeList[] = vehicleList.map(x=> ({item_text:x.name, item_id:x.code, item_count:0, checked:false}));

        let category:FilterCategoryTransport[] = [
            {
                "code":"1",
                "name":"VIP",
                "checked":false,
                "roundTrip":true,
                "mazarat":true,
                "meal":true,
                "count":0
            },
            {
                "code":"2",
                "name":"Premium",
                "checked":false,
                "roundTrip":true,
                "mazarat":true,
                "meal":false,
                "count":0
            },
            {
                "code":"3",
                "name":"Normal",
                "checked":false,
                "roundTrip":true,
                "mazarat":false,
                "meal":false,
                "count":0
            }
        ];

        let vehicleModel:FilterVehicleModel[]=[];

        let additionalServiceList:FilterAdditionalServiceTransport[]=[];
        
        transport.forEach(data =>{

            let categoryIndex = category.findIndex(x => x.code === data.categories[0].category_code);
            if(categoryIndex >= 0){
                category[categoryIndex].count++;
            }

            let vehicletypeIndex = filterVehicleType.findIndex(x => x.item_id === data.vehicle_type_code);
            if(vehicletypeIndex >= 0){
                filterVehicleType[vehicletypeIndex].item_count++;
            }

            let indexModel = vehicleModel.findIndex(x => x.model === data.categories[0].model);
            if(indexModel == -1){
                let val = {
                    "model":data.categories[0].model,
                    "count":1,
                    "checked":false
                }
                vehicleModel.push(val)
            }else{
                vehicleModel[indexModel].count++;
            }
            
            data.categories[0].additional_services.forEach(val =>{
                let additionalIndex = additionalServiceList.findIndex(x => x.additional_service_code === val.additional_service_code)
                if(additionalIndex == -1){
                    let x = {
                        "additional_service_code":val.additional_service_code,
                        "description":val.description,
                        "count":1,
                        "checked":false
                    }
                    additionalServiceList.push(x)
                }else{
                    additionalServiceList[additionalIndex].count++;
                }
            })
        })

        let filterDatas:TransportFilterData = {
            "category":category,
            "vehicle_type":filterVehicleType,
            "vehicle_model":vehicleModel,
            "additional_service":additionalServiceList
        }

        return filterDatas;
        
    }

    transportListFilter(list:any,filterData:TransportFilterPostData){
        let categoryList = [];
        let vehicleTypeList = [];
        let vehicleModelList = [];
        let additionalServiceList = [];

        if(filterData.category_id.length > 0){
            categoryList = list.filter(e => filterData.category_id.includes(e.categories[0].category_code))
        }else{
            categoryList = list;
        }
        if(filterData.vehicle_type_id.length > 0){
            vehicleTypeList = categoryList.filter(e => filterData.vehicle_type_id.includes(e.vehicle_type_code))
        }else{
            vehicleTypeList = categoryList;
        }
        if(filterData.vehicle_model.length > 0){
            vehicleModelList = vehicleTypeList.filter(e => filterData.vehicle_model.includes(e.categories[0].model))
        }else{
            vehicleModelList = vehicleTypeList;
        }
        if(filterData.additional_service_id.length > 0){
            additionalServiceList = vehicleModelList.filter(e => {
                return e.categories[0].additional_services.filter(x => filterData.additional_service_id.includes(x.additional_service_code)).length > 0
            })
        }else{
            additionalServiceList = vehicleModelList;
        }
        return additionalServiceList;
    }

    sortTransportList(id:number,list){
        if(id == 1){
            return list.sort((a,b) => a.display_price - b.display_price);
        }else if(id == 2){
            return list.sort((a, b) => b.display_price - a.display_price);
        }else if(id == 3){
            return list.sort((a, b) => a.categories[0].is_favorited === b.categories[0].is_favorited? 0 : (a.categories[0].is_favorited ? -1 : 1));
        }else if(id == 4){
            return list.sort((a, b) => (a.company_name.toUpperCase() < b.company_name.toUpperCase()) ? -1 : (a.company_name.toUpperCase() > b.company_name.toUpperCase()) ? 1: 0);
        }
    }

}