export class SubAgentTransportAdapter {

    constructor() {
    }

    postTransport(evt,aditionalService,searchDataParams,searchId,selectLangCode) {
        let key = evt.company_code + '-' + evt.vehicle_type_code + '-' + evt.categories[0].category_code;
        let arrayList = [];
        let firstcategory = [];
        let category = {
            code: evt.categories[0].category_code,
            additional_services: aditionalService[key],
            quantity: searchDataParams.count,
            pax_per_vehicle: searchDataParams.pax,
        }
        firstcategory.push(category);
        const q = {
            code: evt.vehicle_type_code,
            categories: firstcategory,
        };
        arrayList.push(q);

        let x = {
            adults: searchDataParams.pax*searchDataParams.count,
            max_passengers: searchDataParams.pax*searchDataParams.count,
            booked_count: searchDataParams.count,
            start_date: searchDataParams.date,
            end_date: searchDataParams.date,
            trip_transportation: {
                search: searchId,
                lang: selectLangCode,
                company_code: evt.company_code,
                vehicle_types: arrayList,
            }
        }

        return x;
    }
}