export interface agency_Appruvel_detaills {
    id: Number;
    primary_contact: {
        id: Number;
        name: String;
        email: String;
        phone_number: String;
        employer_type:String;
        employer_id: Number;
        employer_name: String;
        role: String;
        is_approved: String;
        is_umrah_operator: String;
    };
    approval_requests: [],
    is_approved: Boolean;
    is_licence_agent: Boolean;
    name: String;
    website: String;
    description: String;
    iban: String;
    licence_no: String;
    active: Boolean;
    approved_on: String;
    umrah_operator: Boolean;
    address: String;
    phone_number:String;
    email: String;
    state: String;
    city: String;
    country: String;
}